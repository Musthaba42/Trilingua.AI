"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import { CourseCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DOMAIN_CONFIG, LANGUAGES } from "@/lib/utils/constants";
import type { CourseCardData, PaginatedResponse } from "@/types";

interface Domain {
  id: string;
  slug: string;
  name: string;
  color: string | null;
}

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<CourseCardData[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDomain) params.set("domain", selectedDomain);
      if (selectedLang) params.set("lang", selectedLang);
      if (selectedDifficulty) params.set("difficulty", selectedDifficulty);
      if (freeOnly) params.set("free", "true");
      if (search) params.set("search", search);

      const res = await fetch(`/api/courses?${params}`);
      const data = await res.json();

      if (data.success) {
        setCourses(data.data.items);
        setTotal(data.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDomain, selectedLang, selectedDifficulty, freeOnly, search]);

  const fetchDomains = useCallback(async () => {
    try {
      const res = await fetch("/api/domains");
      const data = await res.json();
      if (data.success) setDomains(data.data);
    } catch (error) {
      console.error("Failed to fetch domains:", error);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  useEffect(() => {
    const timeout = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timeout);
  }, [fetchCourses]);

  const hasActiveFilters = selectedDomain || selectedLang || selectedDifficulty || freeOnly;

  const clearFilters = () => {
    setSelectedDomain("");
    setSelectedLang("");
    setSelectedDifficulty("");
    setFreeOnly(false);
    setSearch("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Course Catalog</h1>
        <p className="text-gray-400 mt-1">
          Explore {total} courses across {domains.length} domains in 3 languages
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "primary" : "secondary"}
          onClick={() => setShowFilters(!showFilters)}
          icon={<Filter size={16} />}
        >
          Filters
          {hasActiveFilters && (
            <span className="ml-1 w-5 h-5 rounded-full bg-primary-400 text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-5 space-y-4"
        >
          {/* Domain filter */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Domain</p>
            <div className="flex flex-wrap gap-2">
              {domains.map((d) => (
                <button
                  key={d.slug}
                  onClick={() => setSelectedDomain(selectedDomain === d.slug ? "" : d.slug)}
                  className={`badge cursor-pointer transition-all ${
                    selectedDomain === d.slug
                      ? "bg-primary-500/30 text-primary-300 border border-primary-500/50"
                      : "bg-dark-surface text-gray-400 hover:text-white"
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Language filter */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Language</p>
            <div className="flex gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLang(selectedLang === l.code ? "" : l.code)}
                  className={`badge cursor-pointer transition-all ${
                    selectedLang === l.code
                      ? "bg-primary-500/30 text-primary-300 border border-primary-500/50"
                      : "bg-dark-surface text-gray-400 hover:text-white"
                  }`}
                >
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty + Free */}
          <div className="flex gap-4 items-end">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Difficulty</p>
              <div className="flex gap-2">
                {["BASIC", "MEDIUM", "PRO"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === d ? "" : d)}
                    className={`badge cursor-pointer transition-all ${
                      selectedDifficulty === d
                        ? "bg-primary-500/30 text-primary-300"
                        : "bg-dark-surface text-gray-400 hover:text-white"
                    }`}
                  >
                    {d === "BASIC" ? "Beginner" : d === "MEDIUM" ? "Intermediate" : "Advanced"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setFreeOnly(!freeOnly)}
              className={`badge cursor-pointer transition-all ${
                freeOnly
                  ? "bg-green-500/30 text-green-400 border border-green-500/50"
                  : "bg-dark-surface text-gray-400 hover:text-white"
              }`}
            >
              Free Only
            </button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} icon={<X size={14} />}>
                Clear
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 text-lg">No courses found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
