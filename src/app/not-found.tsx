"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

// 100 curated programming quotes
const quotes = [
  { q: "Talk is cheap. Show me the code.", a: "Linus Torvalds" },
  { q: "The best error message is the one that never shows up.", a: "Thomas Fuchs" },
  { q: "Code is like humor. When you have to explain it, it's bad.", a: "Cory House" },
  { q: "First, solve the problem. Then, write the code.", a: "John Johnson" },
  { q: "Make it work, make it right, make it fast.", a: "Kent Beck" },
  { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
  { q: "Programs must be written for people to read.", a: "Harold Abelson" },
  { q: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", a: "Martin Fowler" },
  { q: "The only way to go fast is to go well.", a: "Robert C. Martin" },
  { q: "Programming is the art of telling another human what one wants the computer to do.", a: "Donald Knuth" },
  { q: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", a: "Antoine de Saint-Exupéry" },
  { q: "Java is to JavaScript what car is to carpet.", a: "Chris Heilmann" },
  { q: "Truth can only be found in one place: the code.", a: "Robert C. Martin" },
  { q: "Give a man a program, frustrate him for a day. Teach a man to program, frustrate him for a lifetime.", a: "Muhammad Waseem" },
  { q: "If debugging is the process of removing bugs, then programming must be the process of putting them in.", a: "Edsger W. Dijkstra" },
  { q: "Programming isn't about what you know; it's about what you can figure out.", a: "Chris Pine" },
  { q: "The most disastrous thing that you can ever learn is your first programming language.", a: "Alan Kay" },
  { q: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.", a: "Dan Salomon" },
  { q: "Deleted code is debugged code.", a: "Jeff Sickel" },
  { q: "If you optimize everything, you will always be unhappy.", a: "Donald Knuth" },
  { q: "Simplicity is prerequisite for reliability.", a: "Edsger W. Dijkstra" },
  { q: "The function of good software is to make the complex appear to be simple.", a: "Grady Booch" },
  { q: "There are only two kinds of languages: the ones people complain about and the ones nobody uses.", a: "Bjarne Stroustrup" },
  { q: "Any application that can be written in JavaScript, will eventually be written in JavaScript.", a: "Jeff Atwood" },
  { q: "Software is like entropy: It is difficult to grasp, weighs nothing, and obeys the Second Law of Thermodynamics.", a: "Norman Augustine" },
  { q: "The best thing about a boolean is even if you are wrong, you are only off by a bit.", a: "Anonymous" },
  { q: "Without requirements or design, programming is the art of adding bugs to an empty text file.", a: "Louis Srygley" },
  { q: "Before software can be reusable it first has to be usable.", a: "Ralph Johnson" },
  { q: "The best performance improvement is the transition from the nonworking state to the working state.", a: "J. Osterhout" },
  { q: "One of my most productive days was throwing away 1000 lines of code.", a: "Ken Thompson" },
  { q: "It's not a bug – it's an undocumented feature.", a: "Anonymous" },
  { q: "The cheapest, fastest, and most reliable components are those that aren't there.", a: "Gordon Bell" },
  { q: "I think Microsoft named .Net so it wouldn't show up in a Unix directory listing.", a: "Oktal" },
  { q: "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.", a: "Bill Gates" },
  { q: "Walking on water and developing software from a specification are easy if both are frozen.", a: "Edward V. Berard" },
  { q: "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.", a: "John Woods" },
  { q: "A language that doesn't affect the way you think about programming is not worth knowing.", a: "Alan Perlis" },
  { q: "There are two ways to write error-free programs; only the third one works.", a: "Alan J. Perlis" },
  { q: "Most good programmers do programming not because they expect to get paid, but because it is fun to program.", a: "Linus Torvalds" },
  { q: "Software and cathedrals are much the same – first we build them, then we pray.", a: "Sam Redwine" },
  { q: "Controlling complexity is the essence of computer programming.", a: "Brian Kernighan" },
  { q: "Copy and paste is a design error.", a: "David Parnas" },
  { q: "Testing can only prove the presence of bugs, not their absence.", a: "Edsger W. Dijkstra" },
  { q: "Documentation is a love letter that you write to your future self.", a: "Damian Conway" },
  { q: "In programming, the hard part isn't solving problems, but deciding what problems to solve.", a: "Paul Graham" },
  { q: "The computer was born to solve problems that did not exist before.", a: "Bill Gates" },
  { q: "Programming is not about typing, it's about thinking.", a: "Rich Hickey" },
  { q: "People think that computer science is the art of geniuses but the actual reality is the opposite.", a: "Donald Knuth" },
  { q: "Every great developer you know got there by solving problems they were unqualified to solve.", a: "Patrick McKenzie" },
  { q: "Code never lies, comments sometimes do.", a: "Ron Jeffries" },
  { q: "The art of debugging is figuring out what you really told your program to do rather than what you thought you told it to do.", a: "Andrew Singer" },
  { q: "Weeks of coding can save you hours of planning.", a: "Anonymous" },
  { q: "It works on my machine.", a: "Every Developer" },
  { q: "Real programmers don't comment their code. If it was hard to write, it should be hard to understand.", a: "Anonymous" },
  { q: "Code is read more often than it is written.", a: "Guido van Rossum" },
  { q: "The best way to predict the future is to implement it.", a: "David Heinemeier Hansson" },
  { q: "Fix the cause, not the symptom.", a: "Steve Maguire" },
  { q: "Optimism is an occupational hazard of programming; feedback is the treatment.", a: "Kent Beck" },
  { q: "Don't comment bad code – rewrite it.", a: "Brian Kernighan" },
  { q: "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs.", a: "Rich Cook" },
  { q: "When debugging, novices insert corrective code; experts remove defective code.", a: "Richard Pattis" },
  { q: "You can't have great software without a great team.", a: "Jim McCarthy" },
  { q: "Most software today is very much like an Egyptian pyramid with millions of bricks piled on top of each other.", a: "Alan Kay" },
  { q: "Good programmers use their brains, but good guidelines save us having to think out every case.", a: "Francis Glassborow" },
  { q: "Low-level programming is good for the programmer's soul.", a: "John Carmack" },
  { q: "It's harder to read code than to write it.", a: "Joel Spolsky" },
  { q: "The most important property of a program is whether it accomplishes the intention of its user.", a: "C.A.R. Hoare" },
  { q: "Shipping is a feature. A really important feature.", a: "Joel Spolsky" },
  { q: "I'm not a great programmer; I'm just a good programmer with great habits.", a: "Kent Beck" },
  { q: "Programming is learned by writing programs.", a: "Brian Kernighan" },
  { q: "You can use an eraser on the drafting table or a sledgehammer on the construction site.", a: "Frank Lloyd Wright" },
  { q: "Never trust a computer you can't throw out a window.", a: "Steve Wozniak" },
  { q: "On two occasions I have been asked, 'If you put into the machine wrong figures, will the right answers come out?'", a: "Charles Babbage" },
  { q: "Hardware: The parts of a computer system that can be kicked.", a: "Jeff Pesis" },
  { q: "Computers are good at following instructions, but not at reading your mind.", a: "Donald Knuth" },
  { q: "A good programmer is someone who always looks both ways before crossing a one-way street.", a: "Doug Linder" },
  { q: "Experience is the name everyone gives to their mistakes.", a: "Oscar Wilde" },
  { q: "Computers are incredibly fast, accurate, and stupid.", a: "Anonymous" },
  { q: "Programming is breaking one big impossible task into several small possible tasks.", a: "Jazzwant" },
  { q: "Simple things should be simple, complex things should be possible.", a: "Alan Kay" },
  { q: "Don't worry if it doesn't work right. If everything did, you'd be out of a job.", a: "Mosher's Law" },
  { q: "Premature optimization is the root of all evil.", a: "Donald Knuth" },
  { q: "Debugging is twice as hard as writing the code in the first place.", a: "Brian Kernighan" },
  { q: "The more I C, the less I see.", a: "Anonymous" },
  { q: "A user interface is like a joke. If you have to explain it, it's not that good.", a: "Martin LeBlanc" },
  { q: "Software is a gas; it expands to fill its container.", a: "Nathan Myhrvold" },
  { q: "Most of you are familiar with the virtues of a programmer. There are three, of course: laziness, impatience, and hubris.", a: "Larry Wall" },
  { q: "In order to understand recursion, one must first understand recursion.", a: "Anonymous" },
  { q: "There is no Ctrl-Z in life.", a: "Anonymous" },
  { q: "A son asked his father, a programmer, why the sun rises in the east. His response: It works, don't touch it!", a: "Anonymous" },
  { q: "If at first you don't succeed; call it version 1.0.", a: "Anonymous" },
  { q: "Programmers are tools for converting caffeine into code.", a: "Anonymous" },
  { q: "UNIX is basically a simple operating system, but you have to be a genius to understand the simplicity.", a: "Dennis Ritchie" },
  { q: "There's no place like 127.0.0.1.", a: "Anonymous" },
  { q: "The code that is the hardest to debug is the code that you know cannot possibly be wrong.", a: "Anonymous" },
  { q: "I have not failed. I've just found 10,000 ways that won't work.", a: "Thomas Edison" },
  { q: "Stay hungry, stay foolish.", a: "Steve Jobs" },
  { q: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.", a: "Mark Zuckerberg" },
  { q: "Done is better than perfect.", a: "Sheryl Sandberg" },
]

export default function NotFound() {
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-8 text-center max-w-lg mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-8xl sm:text-9xl font-bold text-accent opacity-80">
            404
          </h1>
          <p className="text-xl sm:text-2xl font-mono text-gray-300">
            page not found
          </p>
        </div>

        <p className="text-gray-500 leading-relaxed">
          this page got lost somewhere in the void.
          but hey, here's some wisdom while you're here:
        </p>

        <div className="pt-2 pb-4 space-y-3">
          <p className="text-gray-400 italic leading-relaxed">
            "{quote.q}"
          </p>
          <p className="text-accent text-sm">
            — {quote.a}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="px-4 py-2 text-sm border border-neutral-700 text-gray-300 hover:text-accent hover:border-accent transition-all duration-200"
          >
            return home
          </Link>
        </div>
      </div>
    </div>
  )
}
