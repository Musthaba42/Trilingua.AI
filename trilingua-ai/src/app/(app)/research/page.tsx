"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Languages, FileText, User, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Paper {
  id: string;
  title: string;
  authors: string;
  domain: string;
  abstract: string;
  year: number;
  url?: string;
}

const MOCK_PAPERS: Paper[] = [
  {
    id: "p1",
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin",
    domain: "AI/ML",
    year: 2017,
    abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
    url: "https://arxiv.org/abs/1706.03762"
  },
  {
    id: "p2",
    title: "Deep Residual Learning for Image Recognition",
    authors: "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
    domain: "AI/ML",
    year: 2015,
    abstract: "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those previously used. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.",
    url: "https://arxiv.org/abs/1512.03385"
  },
  {
    id: "p3",
    title: "Generative Adversarial Nets",
    authors: "Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio",
    domain: "AI/ML",
    year: 2014,
    abstract: "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.",
    url: "https://arxiv.org/abs/1406.2661"
  },
  {
    id: "p4",
    title: "Python: An Object-Oriented, Dynamically Typed Scripting Language",
    authors: "Guido van Rossum",
    domain: "Python",
    year: 1995,
    abstract: "Python is an interpreted, object-oriented, high-level programming language with dynamic semantics. Its high-level built in data structures, combined with dynamic typing and dynamic binding, make it very attractive for Rapid Application Development, as well as for use as a scripting or glue language.",
    url: "https://www.python.org/doc/essays/omg-papers/"
  },
  {
    id: "p5",
    title: "A Method for Obtaining Digital Signatures and Public-Key Cryptosystems",
    authors: "R.L. Rivest, A. Shamir, L. Adleman",
    domain: "Cybersecurity",
    year: 1978,
    abstract: "An encryption method is presented with the novel property that revealing an encryption key does not reveal the corresponding decryption key. This admits a new signature scheme and public key system. We also discuss how to implement the system and analyze its security.",
    url: "https://dl.acm.org/doi/10.1145/359340.359342"
  },
  {
    id: "p6",
    title: "Responsive Web Design",
    authors: "Ethan Marcotte",
    domain: "Web Dev",
    year: 2010,
    abstract: "Rather than tailoring disconnected designs to each of an ever-expanding number of web devices, we can treat them as facets of the same experience. We can design for an optimal viewing experience across a wide range of devices using fluid grids, flexible images, and media queries.",
    url: "https://alistapart.com/article/responsive-web-design/"
  }
];

const DOMAINS = ["All", "AI/ML", "Python", "Cybersecurity", "Web Dev"];

export default function ResearchPage() {
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [language, setLanguage] = useState<"English" | "Tamil" | "Hindi">("English");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [errorId, setErrorId] = useState<string | null>(null);

  const filteredPapers = selectedDomain === "All"
    ? MOCK_PAPERS
    : MOCK_PAPERS.filter(p => p.domain === selectedDomain);

  const handleSummarize = async (paper: Paper) => {
    setLoadingId(paper.id);
    setErrorId(null);
    try {
      const res = await fetch("/api/ai/research-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
          language
        })
      });
      const data = await res.json();
      if (data.success && data.data?.summary) {
        setSummaries(prev => ({
          ...prev,
          [`${paper.id}_${language}`]: data.data.summary
        }));
      } else {
        setErrorId(paper.id);
      }
    } catch (err) {
      console.error(err);
      setErrorId(paper.id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-primary-500" /> Research Papers Hub
        </h1>
        <p className="text-gray-400 mt-1">
          Explore breakthrough academic papers and summarize them instantly with Gemini AI in English, Tamil, or Hindi.
        </p>
      </div>

      {/* Control Panel: Filters & Languages */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-card/50 p-4 rounded-xl border border-dark-border">
        {/* Domain Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map(domain => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                selectedDomain === domain
                  ? "bg-primary-600/20 border-primary-500 text-primary-300 shadow-glow"
                  : "bg-dark-surface border-dark-border text-gray-400 hover:text-white hover:border-gray-700"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center gap-2 bg-dark-surface p-1 rounded-lg border border-dark-border">
          <span className="text-xs text-gray-500 px-2 flex items-center gap-1.5 font-medium">
            <Languages size={14} /> Output:
          </span>
          {(["English", "Tamil", "Hindi"] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                language === lang
                  ? "bg-primary-600/20 text-primary-300 border border-primary-500/25"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {lang === "English" ? "EN" : lang === "Tamil" ? "TA" : "HI"}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPapers.map(paper => {
          const currentSummary = summaries[`${paper.id}_${language}`];
          const isLoading = loadingId === paper.id;
          const hasError = errorId === paper.id;

          return (
            <motion.div
              key={paper.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 flex flex-col justify-between hover:border-primary-500/30 hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Meta info & Domain Badges */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                    paper.domain === "AI/ML" ? "bg-purple-500/20 text-purple-300 border border-purple-500/20" :
                    paper.domain === "Python" ? "bg-blue-500/20 text-blue-300 border border-blue-500/20" :
                    paper.domain === "Cybersecurity" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20" :
                    "bg-orange-500/20 text-orange-300 border border-orange-500/20"
                  }`}>
                    {paper.domain}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">{paper.year}</span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors leading-snug">
                    {paper.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 font-medium">
                    <User size={13} className="text-gray-500" />
                    <span className="truncate">{paper.authors}</span>
                  </div>
                </div>

                {/* Abstract Preview */}
                <div className="bg-dark-surface/40 p-4 rounded-lg border border-dark-border/40">
                  <h4 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Abstract</h4>
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {paper.abstract}
                  </p>
                </div>

                {/* AI Summary Display Container */}
                <AnimatePresence mode="wait">
                  {currentSummary && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-primary-950/10 border border-primary-500/20 p-4 rounded-lg space-y-2 overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary-300">
                        <Sparkles size={14} className="text-primary-400" />
                        <span>AI 5-Line Summary ({language})</span>
                      </div>
                      <div className="text-xs text-gray-200 leading-relaxed font-sans space-y-1 bg-dark-bg/20 p-2.5 rounded border border-primary-500/10 whitespace-pre-line">
                        {currentSummary}
                      </div>
                    </motion.div>
                  )}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-2 p-4 bg-dark-surface/40 border border-dark-border rounded-lg"
                    >
                      <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-[10px] text-gray-500">Generating summary in {language}...</span>
                    </motion.div>
                  )}

                  {hasError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg flex items-start gap-2 text-xs text-red-200"
                    >
                      <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={14} />
                      <div className="flex-1 space-y-1">
                        <p>Failed to generate summary. Please check your Gemini connection.</p>
                        <button
                          onClick={() => handleSummarize(paper)}
                          className="text-[10px] text-primary-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <RefreshCw size={10} /> Try Again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-dark-border/40">
                <Button
                  onClick={() => handleSummarize(paper)}
                  disabled={isLoading}
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs font-semibold py-2 flex items-center justify-center gap-1.5"
                  icon={<Sparkles size={14} />}
                >
                  {currentSummary ? "Re-Summarize" : "Summarize with AI"}
                </Button>
                {paper.url && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-dark-border text-gray-400 hover:text-white rounded-md transition-colors hover:bg-dark-hover"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
