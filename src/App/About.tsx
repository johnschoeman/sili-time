import { JSX } from "solid-js"

import Header from "./Header"

const About = (): JSX.Element => {
  return (
    <div>
      <Header />
      <div class="p-4 space-y-8">
        <h1 class="font-bold text-xl">Seximal Invariant Light Interval Time</h1>

        <div class="space-y-2">
          <p>
            Divide the day into 12 equal segments, or Light Segments, called
            Legs
          </p>
          <p>
            Divide the night into 12 equal segments, called or Night Segments,
            called Negs
          </p>
          <p>Divide each Leg into 60 Legens and each Legen into 60 Legets</p>
          <p>Divide each Neg into 60 Negens and each Negen into 60 Negets</p>
          <p>Sunrise is Leg 0 Legen 0 Leget 0, L:00:00:00</p>
          <p>Sunset is Neg 0 Negen 0 Neget 0, N:00:00:00</p>

          <p>Write numbers in seximal (optional)</p>
        </div>
      </div>
    </div>
  )
}

export default About
