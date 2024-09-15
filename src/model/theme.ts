export type Theme = "Dark" | "Light"

type MatchProps<T> = {
  onDark: () => T
  onLight: () => T
}
export const match =
  <T>({ onDark, onLight }: MatchProps<T>) =>
  (theme: Theme): T => {
    switch (theme) {
      case "Dark":
        return onDark()
      case "Light":
        return onLight()
    }
  }

export const toggle = (theme: Theme): Theme => {
  switch (theme) {
    case "Dark":
      return "Light"
    case "Light":
      return "Dark"
  }
}

export const toStyle = (theme: Theme): string => {
  switch (theme) {
    case "Dark":
      return "dark"
    case "Light":
      return ""
  }
}
