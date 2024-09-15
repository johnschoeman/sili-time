import { pipe, String } from "effect"

export type NumberBase = "Binary" | "Seximal" | "Decimal"

export const toggle = (numberBase: NumberBase): NumberBase => {
  switch (numberBase) {
    case "Binary":
      return "Seximal"
    case "Seximal":
      return "Decimal"
    case "Decimal":
      return "Binary"
  }
}

type MatchProps<T> = {
  onBinary: () => T
  onSeximal: () => T
  onDecimal: () => T
}
export const match =
  <T>({ onBinary, onSeximal, onDecimal }: MatchProps<T>) =>
  (numberBase: NumberBase): T => {
    switch (numberBase) {
      case "Binary":
        return onBinary()
      case "Seximal":
        return onSeximal()
      case "Decimal":
        return onDecimal()
    }
  }

export const toPercentageIn =
  (numberBase: NumberBase) =>
  (num: number): string => {
    return pipe(
      num,
      num_ => {
        switch (numberBase) {
          case "Binary":
            return num_ * 4
          case "Seximal":
            return num_ * 36
          case "Decimal":
            return num_ * 100
        }
      },
      num_ => {
        switch (numberBase) {
          case "Binary":
            return num_.toString(2)
          case "Seximal":
            return num_.toString(6)
          case "Decimal":
            return num_.toString(10)
        }
      },
      num_ => {
        switch (numberBase) {
          case "Binary":
            return String.padEnd(2, "0")(num_)
          case "Seximal":
            return String.padEnd(2, "0")(num_)
          case "Decimal":
            return String.padEnd(2, "0")(num_)
        }
      },
      num_ => {
        switch (numberBase) {
          case "Binary":
            return String.takeLeft(14)(num_)
          case "Seximal":
            return String.takeLeft(6)(num_)
          case "Decimal":
            return String.takeLeft(5)(num_)
        }
      },
    )
  }

export const showNumberIn =
  (numberBase: NumberBase) =>
  (num: number): string => {
    switch (numberBase) {
      case "Binary":
        return num.toString(2)
      case "Seximal":
        return num.toString(6)
      case "Decimal":
        return num.toString(10)
    }
  }
