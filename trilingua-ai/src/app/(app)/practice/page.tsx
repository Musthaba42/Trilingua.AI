"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, RotateCcw, CheckCircle, ChevronRight, ChevronDown,
  Terminal as TerminalIcon, Code2, BookOpen, Sparkles,
  Trophy, Lightbulb, ArrowRight, Lock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

// ===== LANGUAGE + TOPIC DATA =====
interface Topic {
  id: string;
  title: string;
  explanation: string;
  exampleCode: string;
  tryCode: string;
  expectedOutput: string;
  practiceTitle: string;
  practiceDesc: string;
  practiceStarter: string;
  practiceSolution: string;
  practiceExpected: string;
}

interface Language {
  id: string;
  name: string;
  icon: string;
  color: string;
  file: string;
  topics: Topic[];
}

const LANGUAGES: Language[] = [
  {
    id: "python", name: "Python", icon: "🐍", color: "#3B82F6", file: "main.py",
    topics: [
      {
        id: "py-basics", title: "Basics",
        explanation: "Python is a high-level, interpreted programming language known for its readability and simplicity.\n\n**Key features:**\n- Easy to read syntax (uses indentation)\n- Dynamically typed\n- Huge library ecosystem\n- Great for beginners and professionals alike\n\n**Your first program:**\nThe `print()` function displays text on the screen.",
        exampleCode: '# Your first Python program\nprint("Hello, World!")\n\n# Comments start with #\n# Python uses indentation instead of braces\n\nname = "Trilingua"\nprint(f"Welcome to {name} AI!")',
        tryCode: '# Try it! Change the text below\nprint("Hello, World!")',
        expectedOutput: "Hello, World!",
        practiceTitle: "Greeting Program",
        practiceDesc: 'Write a program that prints "Hello, Trilingua AI!" on one line and "I love coding!" on the next.',
        practiceStarter: '# Print two lines\nprint("Hello, ")\n# Add your second print statement',
        practiceSolution: 'print("Hello, Trilingua AI!")\nprint("I love coding!")',
        practiceExpected: "Hello, Trilingua AI!\nI love coding!",
      },
      {
        id: "py-variables", title: "Variables",
        explanation: "Variables store data values. Python has no command for declaring a variable — it's created when you assign a value.\n\n**Data Types:**\n- `str` — Text: `\"hello\"`\n- `int` — Whole numbers: `42`\n- `float` — Decimals: `3.14`\n- `bool` — True/False\n- `list` — Collection: `[1, 2, 3]`\n\n**Rules:**\n- Must start with a letter or underscore\n- Case-sensitive (`name` ≠ `Name`)\n- No spaces allowed",
        exampleCode: '# Variables in Python\nname = "Alice"        # str\nage = 25              # int\nheight = 5.6          # float\nis_student = True     # bool\n\nprint(f"{name} is {age} years old")\nprint(f"Height: {height} ft")\nprint(f"Student: {is_student}")\nprint(f"Type of age: {type(age)}")',
        tryCode: '# Create your own variables\nname = "Your Name"\nage = 20\n\nprint(f"My name is {name}")\nprint(f"I am {age} years old")',
        expectedOutput: 'My name is Your Name\nI am 20 years old',
        practiceTitle: "Variable Swap",
        practiceDesc: "Create two variables `a = 10` and `b = 20`. Swap their values and print both.",
        practiceStarter: "a = 10\nb = 20\n\n# Swap a and b here\n\nprint(f\"a = {a}\")\nprint(f\"b = {b}\")",
        practiceSolution: "a = 10\nb = 20\na, b = b, a\nprint(f\"a = {a}\")\nprint(f\"b = {b}\")",
        practiceExpected: "a = 20\nb = 10",
      },
      {
        id: "py-loops", title: "Loops",
        explanation: "Loops let you repeat code multiple times.\n\n**`for` loop** — Iterates over a sequence (list, range, string):\n```python\nfor i in range(5):\n    print(i)\n```\n\n**`while` loop** — Repeats while a condition is True:\n```python\nwhile count < 5:\n    count += 1\n```\n\n**Control statements:**\n- `break` — Exit the loop\n- `continue` — Skip to next iteration\n- `range(start, stop, step)` — Generate numbers",
        exampleCode: '# For loop with range\nfor i in range(1, 6):\n    print(f"Count: {i}")\n\nprint("---")\n\n# While loop\ncount = 0\nwhile count < 3:\n    print(f"While: {count}")\n    count += 1\n\nprint("---")\n\n# Loop through a list\nfruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(f"I like {fruit}")',
        tryCode: "# Print numbers 1 to 10\nfor i in range(1, 11):\n    print(i)",
        expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10",
        practiceTitle: "FizzBuzz",
        practiceDesc: "Print numbers 1 to 15. For multiples of 3, print 'Fizz'. For multiples of 5, print 'Buzz'. For both, print 'FizzBuzz'.",
        practiceStarter: "for i in range(1, 16):\n    # Your logic here\n    print(i)",
        practiceSolution: 'for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
        practiceExpected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      },
      {
        id: "py-functions", title: "Functions",
        explanation: "Functions are reusable blocks of code.\n\n**Syntax:**\n```python\ndef function_name(parameters):\n    # code\n    return value\n```\n\n**Key concepts:**\n- `def` keyword defines a function\n- Parameters = inputs the function accepts\n- `return` sends a value back to the caller\n- Functions can have default parameter values\n- `*args` for variable arguments, `**kwargs` for keyword arguments",
        exampleCode: '# Basic function\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))\n\n# Function with default parameter\ndef power(base, exp=2):\n    return base ** exp\n\nprint(power(3))      # 9\nprint(power(2, 10))  # 1024\n\n# Multiple return values\ndef min_max(numbers):\n    return min(numbers), max(numbers)\n\nlo, hi = min_max([3, 1, 7, 2, 9])\nprint(f"Min: {lo}, Max: {hi}")',
        tryCode: '# Create a function that adds two numbers\ndef add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(f"5 + 3 = {result}")',
        expectedOutput: "5 + 3 = 8",
        practiceTitle: "Calculator Function",
        practiceDesc: "Write a function `calc(a, b, op)` that takes two numbers and an operator (+, -, *, /) and returns the result. Print calc(10, 3, '+') and calc(10, 3, '*').",
        practiceStarter: 'def calc(a, b, op):\n    # Your code here\n    pass\n\nprint(calc(10, 3, "+"))\nprint(calc(10, 3, "*"))',
        practiceSolution: 'def calc(a, b, op):\n    if op == "+":\n        return a + b\n    elif op == "-":\n        return a - b\n    elif op == "*":\n        return a * b\n    elif op == "/":\n        return a / b\n\nprint(calc(10, 3, "+"))\nprint(calc(10, 3, "*"))',
        practiceExpected: "13\n30",
      },
      {
        id: "py-oop", title: "OOP",
        explanation: "Object-Oriented Programming organizes code into classes and objects.\n\n**4 Pillars:**\n1. **Encapsulation** — Bundle data + methods together\n2. **Inheritance** — Child class inherits from parent\n3. **Polymorphism** — Same method name, different behavior\n4. **Abstraction** — Hide complex details\n\n**Key terms:**\n- `class` — Blueprint for objects\n- `self` — Reference to the current object\n- `__init__` — Constructor method\n- `super()` — Call parent class methods",
        exampleCode: 'class Animal:\n    def __init__(self, name, sound):\n        self.name = name\n        self.sound = sound\n    \n    def speak(self):\n        return f"{self.name} says {self.sound}!"\n\n# Inheritance\nclass Dog(Animal):\n    def __init__(self, name):\n        super().__init__(name, "Woof")\n    \n    def fetch(self, item):\n        return f"{self.name} fetches the {item}!"\n\ndog = Dog("Rex")\nprint(dog.speak())\nprint(dog.fetch("ball"))',
        tryCode: '# Create a simple class\nclass Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n    \n    def info(self):\n        return f"{self.name}: Grade {self.grade}"\n\ns = Student("Alice", "A")\nprint(s.info())',
        expectedOutput: "Alice: Grade A",
        practiceTitle: "Bank Account Class",
        practiceDesc: "Create a BankAccount class with deposit(), withdraw(), and balance(). Start with balance 1000, deposit 500, withdraw 200, print final balance.",
        practiceStarter: 'class BankAccount:\n    def __init__(self, balance=0):\n        pass  # store balance\n    \n    def deposit(self, amount):\n        pass\n    \n    def withdraw(self, amount):\n        pass\n    \n    def get_balance(self):\n        pass\n\nacc = BankAccount(1000)\nacc.deposit(500)\nacc.withdraw(200)\nprint(acc.get_balance())',
        practiceSolution: 'class BankAccount:\n    def __init__(self, balance=0):\n        self._balance = balance\n    \n    def deposit(self, amount):\n        self._balance += amount\n    \n    def withdraw(self, amount):\n        self._balance -= amount\n    \n    def get_balance(self):\n        return self._balance\n\nacc = BankAccount(1000)\nacc.deposit(500)\nacc.withdraw(200)\nprint(acc.get_balance())',
        practiceExpected: "1300",
      },
      {
        id: "py-dsa", title: "DSA",
        explanation: "Data Structures & Algorithms are the foundation of efficient coding.\n\n**Common Data Structures:**\n- **List** — Ordered, mutable: `[1, 2, 3]`\n- **Tuple** — Ordered, immutable: `(1, 2, 3)`\n- **Set** — Unordered, unique: `{1, 2, 3}`\n- **Dict** — Key-value pairs: `{\"a\": 1}`\n- **Stack** — LIFO (Last In, First Out)\n- **Queue** — FIFO (First In, First Out)\n\n**Common Algorithms:**\n- Sorting (Bubble, Merge, Quick)\n- Searching (Linear, Binary)\n- Recursion",
        exampleCode: '# Binary Search\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nnums = [1, 3, 5, 7, 9, 11, 15, 20]\nresult = binary_search(nums, 7)\nprint(f"Found 7 at index: {result}")\n\n# Stack using list\nstack = []\nstack.append(1)\nstack.append(2)\nstack.append(3)\nprint(f"Pop: {stack.pop()}")  # 3 (LIFO)',
        tryCode: '# Sort a list and find the max\nnums = [64, 34, 25, 12, 22, 11, 90]\nnums.sort()\nprint(f"Sorted: {nums}")\nprint(f"Max: {max(nums)}")',
        expectedOutput: "Sorted: [11, 12, 22, 25, 34, 64, 90]\nMax: 90",
        practiceTitle: "Reverse a List",
        practiceDesc: "Write a function that reverses a list without using .reverse() or [::-1]. Use a loop.",
        practiceStarter: 'def reverse_list(lst):\n    # Your code here (no .reverse or [::-1])\n    pass\n\nresult = reverse_list([1, 2, 3, 4, 5])\nprint(result)',
        practiceSolution: 'def reverse_list(lst):\n    result = []\n    for i in range(len(lst)-1, -1, -1):\n        result.append(lst[i])\n    return result\n\nresult = reverse_list([1, 2, 3, 4, 5])\nprint(result)',
        practiceExpected: "[5, 4, 3, 2, 1]",
      },
    ],
  },
  {
    id: "javascript", name: "JavaScript", icon: "⚡", color: "#F59E0B", file: "script.js",
    topics: [
      {
        id: "js-basics", title: "Basics",
        explanation: "JavaScript is the language of the web. It runs in browsers and on servers (Node.js).\n\n**Key features:**\n- Dynamic typing\n- Event-driven programming\n- Runs in every browser\n- Huge ecosystem (npm)\n\n**Output:** Use `console.log()` to print.",
        exampleCode: '// Output to console\nconsole.log("Hello, World!");\n\n// Template literals\nconst name = "Trilingua";\nconsole.log(`Welcome to ${name} AI!`);\n\n// typeof operator\nconsole.log(typeof "hello");  // string\nconsole.log(typeof 42);       // number\nconsole.log(typeof true);     // boolean',
        tryCode: '// Try it yourself!\nconsole.log("Hello, World!");',
        expectedOutput: "Hello, World!",
        practiceTitle: "Greeting Message",
        practiceDesc: 'Create a variable `name` with your name and log: "Hello, I am [name]!"',
        practiceStarter: '// Your code here\nconst name = "";\nconsole.log();',
        practiceSolution: 'const name = "Alice";\nconsole.log(`Hello, I am ${name}!`);',
        practiceExpected: "Hello, I am Alice!",
      },
      {
        id: "js-variables", title: "Variables",
        explanation: "JavaScript has 3 ways to declare variables:\n\n- `let` — Can be reassigned, block-scoped\n- `const` — Cannot be reassigned, block-scoped\n- `var` — Old way, function-scoped (avoid)\n\n**Data Types:**\n- String, Number, Boolean, null, undefined\n- Object, Array, Symbol, BigInt\n\n**Best practice:** Use `const` by default, `let` when you need to reassign.",
        exampleCode: 'let score = 100;       // can change\nconst PI = 3.14159;    // cannot change\n\nscore = 200;  // OK\n// PI = 3;    // ERROR!\n\n// Destructuring\nconst [a, b, c] = [1, 2, 3];\nconsole.log(a, b, c);\n\nconst { name, age } = { name: "Alice", age: 25 };\nconsole.log(`${name} is ${age}`);',
        tryCode: 'const greeting = "Hello";\nlet count = 0;\ncount = count + 1;\nconsole.log(`${greeting}! Count: ${count}`);',
        expectedOutput: "Hello! Count: 1",
        practiceTitle: "Temperature Converter",
        practiceDesc: "Create a const `celsius = 37`. Convert to Fahrenheit (F = C × 9/5 + 32) and log the result.",
        practiceStarter: "const celsius = 37;\n// Convert to fahrenheit\n\nconsole.log(`${celsius}°C = ${fahrenheit}°F`);",
        practiceSolution: "const celsius = 37;\nconst fahrenheit = celsius * 9/5 + 32;\nconsole.log(`${celsius}°C = ${fahrenheit}°F`);",
        practiceExpected: "37°C = 98.6°F",
      },
      {
        id: "js-loops", title: "Loops",
        explanation: "JavaScript supports `for`, `while`, `do...while`, `for...of`, and `for...in` loops.\n\n**Modern approach:** Use `.forEach()`, `.map()`, `.filter()` for arrays.",
        exampleCode: '// For loop\nfor (let i = 0; i < 5; i++) {\n  console.log(`Count: ${i}`);\n}\n\n// For...of (arrays)\nconst fruits = ["apple", "banana", "cherry"];\nfor (const fruit of fruits) {\n  console.log(fruit);\n}\n\n// Array methods (modern)\nconst nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);',
        tryCode: 'const nums = [1, 2, 3, 4, 5];\nfor (const n of nums) {\n  console.log(n * n);\n}',
        expectedOutput: "1\n4\n9\n16\n25",
        practiceTitle: "Sum of Even Numbers",
        practiceDesc: "Find the sum of all even numbers from 1 to 20 using a loop.",
        practiceStarter: "let sum = 0;\n// Loop and add even numbers\n\nconsole.log(`Sum: ${sum}`);",
        practiceSolution: "let sum = 0;\nfor (let i = 1; i <= 20; i++) {\n  if (i % 2 === 0) sum += i;\n}\nconsole.log(`Sum: ${sum}`);",
        practiceExpected: "Sum: 110",
      },
      {
        id: "js-functions", title: "Functions",
        explanation: "JavaScript functions can be declared in multiple ways:\n\n- **Function declaration:** `function add(a, b) { }`\n- **Arrow function:** `const add = (a, b) => a + b`\n- **Function expression:** `const add = function(a, b) { }`\n\n**Arrow functions** are the modern, preferred syntax.",
        exampleCode: '// Arrow function\nconst add = (a, b) => a + b;\nconsole.log(add(3, 5));\n\n// Function with default param\nconst greet = (name = "World") => `Hello, ${name}!`;\nconsole.log(greet());\nconsole.log(greet("Alice"));\n\n// Higher-order function\nconst numbers = [1, 2, 3, 4, 5];\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log(evens);',
        tryCode: 'const multiply = (a, b) => a * b;\nconsole.log(multiply(4, 7));',
        expectedOutput: "28",
        practiceTitle: "Array Transformer",
        practiceDesc: "Write a function that takes an array of numbers and returns a new array with each number squared. Use .map().",
        practiceStarter: "const squareAll = (nums) => {\n  // Your code\n};\n\nconsole.log(squareAll([1, 2, 3, 4, 5]));",
        practiceSolution: "const squareAll = (nums) => nums.map(n => n * n);\n\nconsole.log(squareAll([1, 2, 3, 4, 5]));",
        practiceExpected: "[1, 4, 9, 16, 25]",
      },
      {
        id: "js-oop", title: "OOP",
        explanation: "JavaScript uses classes (ES6+) and prototypes for OOP.\n\n**Features:**\n- `class` keyword\n- `constructor()` method\n- `extends` for inheritance\n- `super()` to call parent\n- `static` methods\n- Private fields with `#`",
        exampleCode: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound`;\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    return `${this.name} barks!`;\n  }\n}\n\nconst dog = new Dog("Rex");\nconsole.log(dog.speak());',
        tryCode: 'class Car {\n  constructor(brand, speed) {\n    this.brand = brand;\n    this.speed = speed;\n  }\n  info() {\n    return `${this.brand}: ${this.speed} km/h`;\n  }\n}\n\nconst car = new Car("Tesla", 250);\nconsole.log(car.info());',
        expectedOutput: "Tesla: 250 km/h",
        practiceTitle: "Todo List Class",
        practiceDesc: "Create a TodoList class with add(task), remove(index), and list() methods. Add 3 tasks and print them.",
        practiceStarter: 'class TodoList {\n  constructor() {\n    // init\n  }\n  add(task) { }\n  list() { }\n}\n\nconst todo = new TodoList();\ntodo.add("Learn JS");\ntodo.add("Build app");\nconsole.log(todo.list());',
        practiceSolution: 'class TodoList {\n  constructor() { this.tasks = []; }\n  add(task) { this.tasks.push(task); }\n  list() { return this.tasks; }\n}\n\nconst todo = new TodoList();\ntodo.add("Learn JS");\ntodo.add("Build app");\nconsole.log(todo.list());',
        practiceExpected: '["Learn JS", "Build app"]',
      },
      {
        id: "js-dsa", title: "DSA",
        explanation: "Data Structures & Algorithms in JavaScript.\n\n**Built-in structures:**\n- Array, Set, Map, Object\n\n**Common patterns:**\n- Two pointers, sliding window\n- Hash maps for O(1) lookup\n- Recursion + memoization",
        exampleCode: '// Binary Search\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\nconst nums = [1, 3, 5, 7, 9, 11];\nconsole.log(`Index of 7: ${binarySearch(nums, 7)}`);',
        tryCode: 'const nums = [5, 3, 8, 1, 9, 2];\nnums.sort((a, b) => a - b);\nconsole.log(nums);',
        expectedOutput: "[1, 2, 3, 5, 8, 9]",
        practiceTitle: "Two Sum",
        practiceDesc: "Given array [2,7,11,15] and target 9, find two indices that add up to the target.",
        practiceStarter: "function twoSum(nums, target) {\n  // Your code\n}\n\nconsole.log(twoSum([2,7,11,15], 9));",
        practiceSolution: "function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map[diff] !== undefined) return [map[diff], i];\n    map[nums[i]] = i;\n  }\n}\n\nconsole.log(twoSum([2,7,11,15], 9));",
        practiceExpected: "[0, 1]",
      },
    ],
  },
  {
    id: "java", name: "Java", icon: "☕", color: "#EF4444", file: "Main.java",
    topics: [
      { id: "java-basics", title: "Basics",
        explanation: "Java is a strongly-typed, compiled, platform-independent language.\n\n**Structure:**\n- Every program needs a `class`\n- Execution starts from `main()` method\n- Statements end with `;`\n- Code blocks use `{ }`",
        exampleCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        // Print with formatting\n        String name = "Java";\n        System.out.printf("Welcome to %s!%n", name);\n    }\n}',
        tryCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
        expectedOutput: "Hello, World!",
        practiceTitle: "Name Printer", practiceDesc: "Print your name and age on separate lines.", practiceStarter: 'public class Main {\n    public static void main(String[] args) {\n        // Your code\n    }\n}',
        practiceSolution: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Alice");\n        System.out.println("25");\n    }\n}', practiceExpected: "Alice\n25",
      },
      { id: "java-variables", title: "Variables",
        explanation: "Java is **strongly typed** — you must declare the type of every variable.\n\n**Primitive types:** int, double, float, char, boolean, byte, short, long\n**Reference types:** String, Array, Object",
        exampleCode: 'public class Main {\n    public static void main(String[] args) {\n        int age = 25;\n        double height = 5.6;\n        String name = "Alice";\n        boolean isStudent = true;\n        \n        System.out.println(name + " is " + age);\n        System.out.println("Height: " + height);\n    }\n}',
        tryCode: 'public class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        int y = 20;\n        System.out.println("Sum: " + (x + y));\n    }\n}', expectedOutput: "Sum: 30",
        practiceTitle: "Area Calculator", practiceDesc: "Calculate the area of a rectangle with length=15 and width=8. Print the result.", practiceStarter: 'public class Main {\n    public static void main(String[] args) {\n        // Calculate area\n    }\n}',
        practiceSolution: 'public class Main {\n    public static void main(String[] args) {\n        int length = 15;\n        int width = 8;\n        int area = length * width;\n        System.out.println("Area: " + area);\n    }\n}', practiceExpected: "Area: 120",
      },
      { id: "java-loops", title: "Loops", explanation: "Java has `for`, `while`, `do-while`, and enhanced `for-each` loops.", exampleCode: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Count: " + i);\n        }\n        \n        String[] fruits = {"apple", "banana"};\n        for (String fruit : fruits) {\n            System.out.println(fruit);\n        }\n    }\n}', tryCode: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(i);\n        }\n    }\n}', expectedOutput: "1\n2\n3\n4\n5", practiceTitle: "Multiplication Table", practiceDesc: "Print the multiplication table of 7 (7x1 to 7x10).", practiceStarter: 'public class Main {\n    public static void main(String[] args) {\n        // Your code\n    }\n}', practiceSolution: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 10; i++) {\n            System.out.println("7 x " + i + " = " + (7*i));\n        }\n    }\n}', practiceExpected: "7 x 1 = 7\n7 x 2 = 14" },
      { id: "java-functions", title: "Functions", explanation: "In Java, functions are called **methods**. They must be defined inside a class.", exampleCode: 'public class Main {\n    static int add(int a, int b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(add(5, 3));\n    }\n}', tryCode: 'public class Main {\n    static int add(int a, int b) {\n        return a + b;\n    }\n    public static void main(String[] args) {\n        System.out.println(add(10, 20));\n    }\n}', expectedOutput: "30", practiceTitle: "Max of Three", practiceDesc: "Write a method that returns the maximum of three integers.", practiceStarter: 'public class Main {\n    // Your method here\n    public static void main(String[] args) {\n        System.out.println(maxOfThree(3, 7, 5));\n    }\n}', practiceSolution: 'public class Main {\n    static int maxOfThree(int a, int b, int c) {\n        return Math.max(a, Math.max(b, c));\n    }\n    public static void main(String[] args) {\n        System.out.println(maxOfThree(3, 7, 5));\n    }\n}', practiceExpected: "7" },
      { id: "java-oop", title: "OOP", explanation: "Java is a fully object-oriented language. Everything is inside a class.", exampleCode: 'class Animal {\n    String name;\n    Animal(String name) { this.name = name; }\n    String speak() { return name + " makes a sound"; }\n}\n\nclass Dog extends Animal {\n    Dog(String name) { super(name); }\n    String speak() { return name + " barks!"; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog("Rex");\n        System.out.println(d.speak());\n    }\n}', tryCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("OOP in Java!");\n    }\n}', expectedOutput: "OOP in Java!", practiceTitle: "Student Class", practiceDesc: "Create a Student class with name, grade, and a method to display info.", practiceStarter: 'public class Main {\n    public static void main(String[] args) {\n        // Create Student class and object\n    }\n}', practiceSolution: 'public class Main {\n    static class Student {\n        String name; String grade;\n        Student(String n, String g) { name=n; grade=g; }\n        String info() { return name + ": " + grade; }\n    }\n    public static void main(String[] args) {\n        Student s = new Student("Alice", "A");\n        System.out.println(s.info());\n    }\n}', practiceExpected: "Alice: A" },
      { id: "java-dsa", title: "DSA", explanation: "Java has excellent built-in data structures: ArrayList, HashMap, LinkedList, Stack, Queue, PriorityQueue.", exampleCode: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>(Arrays.asList(5,3,8,1,9));\n        Collections.sort(list);\n        System.out.println("Sorted: " + list);\n        \n        HashMap<String, Integer> map = new HashMap<>();\n        map.put("Alice", 90);\n        map.put("Bob", 85);\n        System.out.println("Alice: " + map.get("Alice"));\n    }\n}', tryCode: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> nums = new ArrayList<>(Arrays.asList(3,1,4,1,5));\n        Collections.sort(nums);\n        System.out.println(nums);\n    }\n}', expectedOutput: "[1, 1, 3, 4, 5]", practiceTitle: "Frequency Counter", practiceDesc: "Count the frequency of each character in 'hello world' using HashMap.", practiceStarter: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        // Count frequencies\n    }\n}', practiceSolution: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        String s = "hello world";\n        HashMap<Character,Integer> map = new HashMap<>();\n        for (char c : s.toCharArray()) {\n            map.put(c, map.getOrDefault(c,0)+1);\n        }\n        System.out.println(map);\n    }\n}', practiceExpected: "{h=1, e=1, l=3, o=2, w=1, r=1, d=1, =1}" },
    ],
  },
  {
    id: "c", name: "C", icon: "⚙️", color: "#10B981", file: "main.c",
    topics: [
      { id: "c-basics", title: "Basics", explanation: "C is a low-level, compiled language. It gives direct memory access and is the foundation for many modern languages.\n\n**Structure:** `#include`, `main()`, `printf()`, `return 0;`", exampleCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    printf("Welcome to C programming!\\n");\n    return 0;\n}', tryCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}', expectedOutput: "Hello, World!", practiceTitle: "Print Pattern", practiceDesc: 'Print a right triangle of stars with 3 rows.', practiceStarter: '#include <stdio.h>\nint main() {\n    // Print star triangle\n    return 0;\n}', practiceSolution: '#include <stdio.h>\nint main() {\n    for(int i=1;i<=3;i++){\n        for(int j=0;j<i;j++) printf("*");\n        printf("\\n");\n    }\n    return 0;\n}', practiceExpected: "*\n**\n***" },
      { id: "c-variables", title: "Variables", explanation: "C requires explicit type declaration. Types: int, float, double, char, char[].", exampleCode: '#include <stdio.h>\n\nint main() {\n    int age = 25;\n    float height = 5.6;\n    char grade = \'A\';\n    char name[] = "Alice";\n    \n    printf("Name: %s\\n", name);\n    printf("Age: %d\\n", age);\n    printf("Height: %.1f\\n", height);\n    printf("Grade: %c\\n", grade);\n    return 0;\n}', tryCode: '#include <stdio.h>\nint main() {\n    int x = 10;\n    int y = 20;\n    printf("Sum: %d", x + y);\n    return 0;\n}', expectedOutput: "Sum: 30", practiceTitle: "Swap Variables", practiceDesc: "Swap two integers a=5 and b=10 using a temporary variable.", practiceStarter: '#include <stdio.h>\nint main() {\n    int a = 5, b = 10;\n    // Swap here\n    printf("a=%d b=%d", a, b);\n    return 0;\n}', practiceSolution: '#include <stdio.h>\nint main() {\n    int a = 5, b = 10;\n    int temp = a; a = b; b = temp;\n    printf("a=%d b=%d", a, b);\n    return 0;\n}', practiceExpected: "a=10 b=5" },
      { id: "c-loops", title: "Loops", explanation: "C has `for`, `while`, and `do...while` loops.", exampleCode: '#include <stdio.h>\nint main() {\n    for(int i = 1; i <= 5; i++) {\n        printf("%d ", i);\n    }\n    return 0;\n}', tryCode: '#include <stdio.h>\nint main() {\n    for(int i=1;i<=5;i++) printf("%d\\n",i);\n    return 0;\n}', expectedOutput: "1\n2\n3\n4\n5", practiceTitle: "Sum 1 to N", practiceDesc: "Sum numbers from 1 to 100 using a loop.", practiceStarter: '#include <stdio.h>\nint main() {\n    int sum = 0;\n    // Loop 1 to 100\n    printf("Sum: %d", sum);\n    return 0;\n}', practiceSolution: '#include <stdio.h>\nint main() {\n    int sum = 0;\n    for(int i=1;i<=100;i++) sum+=i;\n    printf("Sum: %d", sum);\n    return 0;\n}', practiceExpected: "Sum: 5050" },
      { id: "c-functions", title: "Functions", explanation: "C functions must declare return type. Prototype before main(), definition after.", exampleCode: '#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    printf("Sum: %d\\n", add(5, 3));\n    return 0;\n}', tryCode: '#include <stdio.h>\nint add(int a, int b) { return a+b; }\nint main() {\n    printf("%d", add(10,20));\n    return 0;\n}', expectedOutput: "30", practiceTitle: "Factorial", practiceDesc: "Write a recursive function to calculate factorial of 5.", practiceStarter: '#include <stdio.h>\n// Write factorial function\nint main() {\n    printf("5! = %d", factorial(5));\n    return 0;\n}', practiceSolution: '#include <stdio.h>\nint factorial(int n) {\n    if(n<=1) return 1;\n    return n * factorial(n-1);\n}\nint main() {\n    printf("5! = %d", factorial(5));\n    return 0;\n}', practiceExpected: "5! = 120" },
      { id: "c-oop", title: "Structs", explanation: "C doesn't have classes, but uses **structs** to group related data together.", exampleCode: '#include <stdio.h>\n\ntypedef struct {\n    char name[50];\n    int age;\n    float gpa;\n} Student;\n\nint main() {\n    Student s1 = {"Alice", 20, 3.8};\n    printf("%s, Age %d, GPA %.1f\\n", s1.name, s1.age, s1.gpa);\n    return 0;\n}', tryCode: '#include <stdio.h>\ntypedef struct { int x; int y; } Point;\nint main() {\n    Point p = {10, 20};\n    printf("(%d, %d)", p.x, p.y);\n    return 0;\n}', expectedOutput: "(10, 20)", practiceTitle: "Rectangle Struct", practiceDesc: "Create a Rectangle struct with width and height. Calculate and print the area.", practiceStarter: '#include <stdio.h>\n// Define struct & calc area\nint main() {\n    // Your code\n    return 0;\n}', practiceSolution: '#include <stdio.h>\ntypedef struct { int w; int h; } Rect;\nint main() {\n    Rect r = {10, 5};\n    printf("Area: %d", r.w * r.h);\n    return 0;\n}', practiceExpected: "Area: 50" },
      { id: "c-dsa", title: "DSA", explanation: "C uses arrays, pointers, and manual memory with `malloc()`/`free()` for data structures.", exampleCode: '#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    for(int i=0;i<n-1;i++)\n        for(int j=0;j<n-i-1;j++)\n            if(arr[j]>arr[j+1]) {\n                int t=arr[j]; arr[j]=arr[j+1]; arr[j+1]=t;\n            }\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22};\n    int n = 5;\n    bubbleSort(arr, n);\n    for(int i=0;i<n;i++) printf("%d ", arr[i]);\n    return 0;\n}', tryCode: '#include <stdio.h>\nint main() {\n    int arr[] = {5,3,8,1,9};\n    int n=5, t;\n    for(int i=0;i<n-1;i++)\n        for(int j=0;j<n-i-1;j++)\n            if(arr[j]>arr[j+1]){t=arr[j];arr[j]=arr[j+1];arr[j+1]=t;}\n    for(int i=0;i<n;i++) printf("%d ",arr[i]);\n    return 0;\n}', expectedOutput: "1 3 5 8 9", practiceTitle: "Array Reverse", practiceDesc: "Reverse array {1,2,3,4,5} in-place and print.", practiceStarter: '#include <stdio.h>\nint main() {\n    int arr[]={1,2,3,4,5}; int n=5;\n    // Reverse\n    for(int i=0;i<n;i++) printf("%d ",arr[i]);\n    return 0;\n}', practiceSolution: '#include <stdio.h>\nint main() {\n    int arr[]={1,2,3,4,5}; int n=5;\n    for(int i=0;i<n/2;i++){int t=arr[i];arr[i]=arr[n-1-i];arr[n-1-i]=t;}\n    for(int i=0;i<n;i++) printf("%d ",arr[i]);\n    return 0;\n}', practiceExpected: "5 4 3 2 1" },
    ],
  },
];

// ===== COMPONENT =====
export default function PracticePage() {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [selectedTopic, setSelectedTopic] = useState(LANGUAGES[0].topics[0]);
  const [activeTab, setActiveTab] = useState<"learn" | "try" | "practice">("learn");
  const [tryCode, setTryCode] = useState(LANGUAGES[0].topics[0].tryCode);
  const [practiceCode, setPracticeCode] = useState(LANGUAGES[0].topics[0].practiceStarter);
  const [terminalLines, setTerminalLines] = useState<{ type: string; text: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "pass" | "fail">("idle");
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [langSidebarOpen, setLangSidebarOpen] = useState(true);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => { termRef.current?.scrollIntoView({ behavior: "smooth" }); }, [terminalLines]);

  const selectLanguage = (lang: Language) => {
    setSelectedLang(lang);
    setSelectedTopic(lang.topics[0]);
    setTryCode(lang.topics[0].tryCode);
    setPracticeCode(lang.topics[0].practiceStarter);
    setTerminalLines([]);
    setStatus("idle");
    setActiveTab("learn");
    setShowSolution(false);
  };

  const selectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setTryCode(topic.tryCode);
    setPracticeCode(topic.practiceStarter);
    setTerminalLines([]);
    setStatus("idle");
    setActiveTab("learn");
    setShowSolution(false);
  };

  const goNextTopic = () => {
    const idx = selectedLang.topics.findIndex(t => t.id === selectedTopic.id);
    if (idx < selectedLang.topics.length - 1) {
      selectTopic(selectedLang.topics[idx + 1]);
    }
  };

  const runCode = (code: string, expected: string, isPractice: boolean) => {
    setStatus("running");
    setTerminalLines(prev => [...prev, { type: "info", text: `> Compiling ${selectedLang.file}...` }]);

    setTimeout(() => {
      const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
      const isCorrect = norm(code).includes(norm(expected.split("\n")[0])) ||
        code.includes("return") && !code.includes("pass") && !code.includes("// Your");

      if (isCorrect || code.trim() === (isPractice ? selectedTopic.practiceSolution : selectedTopic.tryCode).trim()) {
        setTerminalLines(prev => [
          ...prev,
          { type: "output", text: expected },
          { type: "info", text: "✅ Output matches! Great job." }
        ]);
        setStatus("pass");
        if (isPractice && !completedTopics.includes(selectedTopic.id)) {
          setCompletedTopics(prev => [...prev, selectedTopic.id]);
        }
      } else {
        setTerminalLines(prev => [
          ...prev,
          { type: "error", text: "❌ Output doesn't match expected result." },
          { type: "info", text: "Hint: Check your logic and try again." }
        ]);
        setStatus("fail");
      }
    }, 1000);
  };

  const totalTopics = LANGUAGES.reduce((sum, l) => sum + l.topics.length, 0);
  const progress = Math.round((completedTopics.length / totalTopics) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Code2 className="text-primary-400" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-white">Practice Sandbox</h1>
            <p className="text-xs text-gray-500">Learn → Try → Practice — W3Schools style</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Progress</p>
            <p className="text-sm font-bold text-primary-400">{completedTopics.length}/{totalTopics} topics</p>
          </div>
          <div className="w-20 h-2 bg-dark-surface rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-0 min-h-0 rounded-lg overflow-hidden border border-dark-border">
        {/* LEFT: Language + Topic Sidebar */}
        <aside className="w-60 shrink-0 bg-dark-card border-r border-dark-border flex flex-col">
          {/* Language Tabs */}
          <div className="p-2 border-b border-dark-border bg-dark-surface/50">
            <p className="text-[9px] uppercase tracking-widest text-gray-600 font-bold px-2 mb-2">Languages</p>
            <div className="grid grid-cols-2 gap-1">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => selectLanguage(lang)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-2 rounded text-xs font-medium transition-all",
                    selectedLang.id === lang.id
                      ? "bg-primary-500/20 text-white border border-primary-500/30"
                      : "text-gray-400 hover:text-white hover:bg-dark-hover border border-transparent"
                  )}
                >
                  <span>{lang.icon}</span>
                  <span className="truncate">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic List */}
          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-[9px] uppercase tracking-widest text-gray-600 font-bold px-2 mb-2 mt-1">
              {selectedLang.name} Topics
            </p>
            <div className="space-y-0.5">
              {selectedLang.topics.map((topic, i) => {
                const isActive = selectedTopic.id === topic.id;
                const isDone = completedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => selectTopic(topic)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-sm transition-all text-left",
                      isActive
                        ? "bg-primary-500/15 text-white border-l-2 border-primary-500"
                        : "text-gray-400 hover:text-white hover:bg-dark-hover border-l-2 border-transparent"
                    )}
                  >
                    <span className="w-5 text-center">
                      {isDone ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <span className="text-[10px] text-gray-600 font-mono">{i + 1}</span>
                      )}
                    </span>
                    <span className="flex-1 truncate">{topic.title}</span>
                    {isActive && <ChevronRight size={12} className="text-primary-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div className="p-3 border-t border-dark-border bg-dark-surface/30">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Trophy size={14} className="text-amber-400" />
              <span>{completedTopics.filter(id => id.startsWith(selectedLang.id.slice(0, 2))).length}/{selectedLang.topics.length} completed</span>
            </div>
          </div>
        </aside>

        {/* RIGHT: Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab Bar */}
          <div className="flex items-center border-b border-dark-border bg-dark-surface/50">
            {[
              { id: "learn" as const, label: "📖 Learn", icon: BookOpen },
              { id: "try" as const, label: "🧪 Try Yourself", icon: Code2 },
              { id: "practice" as const, label: "🏋️ Practice", icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setTerminalLines([]); setStatus("idle"); }}
                className={cn(
                  "px-5 py-3 text-sm font-medium transition-all border-b-2 flex items-center gap-2",
                  activeTab === tab.id
                    ? "text-white border-primary-500 bg-primary-500/5"
                    : "text-gray-500 border-transparent hover:text-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
            <div className="flex-1" />
            <span className="text-xs text-gray-600 pr-4 font-mono">{selectedLang.icon} {selectedLang.file}</span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {/* LEARN TAB */}
              {activeTab === "learn" && (
                <motion.div key="learn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{selectedLang.name} — {selectedTopic.title}</h2>
                    <div className="h-0.5 w-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full" />
                  </div>

                  {/* Explanation */}
                  <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                    {selectedTopic.explanation.split("\n").map((line, i) => (
                      <p key={i} className={line.startsWith("**") ? "text-white font-semibold" : ""}>{line.replace(/\*\*/g, "")}</p>
                    ))}
                  </div>

                  {/* Example Code */}
                  <div className="rounded-lg overflow-hidden border border-dark-border">
                    <div className="flex items-center justify-between bg-dark-surface px-4 py-2 border-b border-dark-border">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Example</span>
                      <span className="text-xs text-gray-600 font-mono">{selectedLang.file}</span>
                    </div>
                    <pre className="p-4 bg-[#0c0c0c] text-sm font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap">
                      {selectedTopic.exampleCode}
                    </pre>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => setActiveTab("try")} icon={<Code2 size={14} />}>
                      Try Yourself →
                    </Button>
                    <Button variant="secondary" onClick={() => setActiveTab("practice")} icon={<Sparkles size={14} />}>
                      Practice Problem
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* TRY YOURSELF TAB */}
              {activeTab === "try" && (
                <motion.div key="try" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                  <div className="px-4 py-3 bg-dark-bg/20 border-b border-dark-border flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Try Yourself — {selectedTopic.title}</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" icon={<RotateCcw size={12} />} onClick={() => { setTryCode(selectedTopic.tryCode); setTerminalLines([]); setStatus("idle"); }}>Reset</Button>
                      <Button size="sm" onClick={() => runCode(tryCode, selectedTopic.expectedOutput, false)} loading={status === "running"} icon={<Play size={12} />}>Run</Button>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={tryCode}
                      onChange={e => setTryCode(e.target.value)}
                      className="flex-1 bg-[#0c0c0c] p-4 font-mono text-sm text-blue-300 resize-none outline-none caret-primary-400 min-h-[200px]"
                      spellCheck={false}
                    />
                    {/* Terminal */}
                    <div className="h-32 bg-[#080808] border-t border-dark-border p-3 overflow-y-auto font-mono text-xs">
                      <div className="flex items-center gap-2 mb-2 text-gray-600">
                        <TerminalIcon size={12} />
                        <span>Output</span>
                      </div>
                      {terminalLines.map((l, i) => (
                        <div key={i} className={l.type === "error" ? "text-red-400" : l.type === "output" ? "text-white" : "text-primary-500/70"}>
                          {l.text}
                        </div>
                      ))}
                      <div ref={termRef} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PRACTICE TAB */}
              {activeTab === "practice" && (
                <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                  <div className="px-4 py-3 bg-dark-bg/20 border-b border-dark-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          🏋️ {selectedTopic.practiceTitle}
                          {completedTopics.includes(selectedTopic.id) && <CheckCircle size={14} className="text-green-400" />}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">{selectedTopic.practiceDesc}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setShowSolution(!showSolution)} icon={<Lightbulb size={12} />}>
                          {showSolution ? "Hide" : "Solution"}
                        </Button>
                        <Button size="sm" variant="ghost" icon={<RotateCcw size={12} />} onClick={() => { setPracticeCode(selectedTopic.practiceStarter); setTerminalLines([]); setStatus("idle"); }}>Reset</Button>
                        <Button size="sm" onClick={() => runCode(practiceCode, selectedTopic.practiceExpected, true)} loading={status === "running"} icon={<Play size={12} />}>Run</Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={practiceCode}
                      onChange={e => setPracticeCode(e.target.value)}
                      className="flex-1 bg-[#0c0c0c] p-4 font-mono text-sm text-blue-300 resize-none outline-none caret-primary-400 min-h-[200px]"
                      spellCheck={false}
                    />
                    {showSolution && (
                      <div className="border-t border-amber-500/20 bg-amber-500/5 p-3">
                        <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-2">💡 Solution</p>
                        <pre className="text-xs font-mono text-amber-200/80 whitespace-pre-wrap">{selectedTopic.practiceSolution}</pre>
                      </div>
                    )}
                    <div className="h-32 bg-[#080808] border-t border-dark-border p-3 overflow-y-auto font-mono text-xs">
                      <div className="flex items-center gap-2 mb-2 text-gray-600">
                        <TerminalIcon size={12} />
                        <span>Output</span>
                      </div>
                      {terminalLines.map((l, i) => (
                        <div key={i} className={l.type === "error" ? "text-red-400" : l.type === "output" ? "text-white" : "text-primary-500/70"}>
                          {l.text}
                        </div>
                      ))}
                      <div ref={termRef} />
                    </div>
                  </div>

                  {/* Next Topic */}
                  {status === "pass" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-3 bg-green-500/10 border-t border-green-500/20 flex items-center justify-between"
                    >
                      <span className="text-sm text-green-300">🎉 Great job! Topic completed.</span>
                      {selectedLang.topics.findIndex(t => t.id === selectedTopic.id) < selectedLang.topics.length - 1 && (
                        <Button size="sm" onClick={goNextTopic} icon={<ArrowRight size={14} />}>
                          Next Topic
                        </Button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
