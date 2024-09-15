import { NumberBase, Theme } from "@app/model"
import { NumberBaseState, ThemeState } from "@app/state"

import { pipe } from "effect"
import { Icon } from "solid-heroicons"
import { moon as moonOutline, sun as sunOutline } from "solid-heroicons/outline"
import { moon as moonSolid, sun as sunSolid } from "solid-heroicons/solid"
import { JSX } from "solid-js"

const Header = (): JSX.Element => {
  const handleOnClickToggleTheme = (): void => {
    ThemeState.toggle()
  }

  const handleOnClickToggleNumberBase = (): void => {
    NumberBaseState.toggle()
  }

  return (
    <div class="flex flex-row justify-between items-center p-4 w-full border-b bdr-gray-400">
      <p class="uppercase font-bold text-xl md:text-2xl lg:text-3xl">
        Sili Time
      </p>

      <div class="flex flex-row space-x-4">
        <button onClick={handleOnClickToggleNumberBase}>
          {pipe(
            NumberBaseState.numberBase(),
            NumberBase.match({
              onBinary: () => <BinaryToggle />,
              onSeximal: () => <SeximalToggle />,
              onDecimal: () => <DecimalToggle />,
            }),
          )}
        </button>

        <button onClick={handleOnClickToggleTheme}>
          {pipe(
            ThemeState.theme(),
            Theme.match({
              onLight: () => <LightToggle />,
              onDark: () => <DarkToggle />,
            }),
          )}
        </button>
      </div>
    </div>
  )
}

const BinaryToggle = (): JSX.Element => {
  return (
    <div class="h-12 flex flex-row items-center py-2 px-4 space-x-2 rounded-full border bdr-gray-400">
      <p class="txt-gray-900">II</p>
      <p class="txt-gray-400">VI</p>
      <p class="txt-gray-400">X</p>
    </div>
  )
}

const SeximalToggle = (): JSX.Element => {
  return (
    <div class="h-12 flex flex-row items-center py-2 px-4 space-x-2 rounded-full border bdr-gray-400">
      <p class="txt-gray-400">II</p>
      <p class="txt-gray-900">VI</p>
      <p class="txt-gray-400">X</p>
    </div>
  )
}

const DecimalToggle = (): JSX.Element => {
  return (
    <div class="h-12 flex flex-row items-center py-2 px-4 space-x-2 rounded-full border bdr-gray-400">
      <p class="txt-gray-400">II</p>
      <p class="txt-gray-400">VI</p>
      <p class="txt-gray-900">X</p>
    </div>
  )
}

const LightToggle = (): JSX.Element => {
  return (
    <div class="h-12 flex flex-row items-center p-2 space-x-2 rounded-full border bdr-gray-400">
      <Icon path={moonOutline} class="txt-gray-400" style="width: 24px" />
      <Icon path={sunSolid} class="txt-gray-900" style="width: 24px" />
    </div>
  )
}

const DarkToggle = (): JSX.Element => {
  return (
    <div class="h-12 flex flex-row items-center p-2 space-x-2 rounded-full border bdr-gray-400">
      <Icon path={moonSolid} class="txt-gray-900" style="width: 24px" />
      <Icon path={sunOutline} class="txt-gray-400" style="width: 24px" />
    </div>
  )
}

export default Header
