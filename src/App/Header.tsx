import { Theme } from "@app/model"
import { ThemeState } from "@app/state"

import { pipe } from "effect"
import { Icon } from "solid-heroicons"
import { moon as moonOutline,sun as sunOutline } from "solid-heroicons/outline"
import { moon as moonSolid,sun as sunSolid } from "solid-heroicons/solid"
import { JSX } from "solid-js"

const Header = (): JSX.Element => {
  const handleOnClickToggleTheme = (): void => {
    ThemeState.toggle()
  }

  return (
    <div class="flex flex-row justify-between items-center p-4 w-full border-b bdr-gray-400">
      <p class="uppercase font-bold text-xl md:text-2xl lg:text-3xl">
        Sili Time
      </p>

      <div>
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

const LightToggle = (): JSX.Element => {
  return (
    <div class="flex flex-row p-2 space-x-2 rounded-full border bdr-gray-400">
      <Icon path={moonOutline} class="txt-gray-400" style="width: 24px" />
      <Icon path={sunSolid} class="txt-gray-900" style="width: 24px" />
    </div>
  )
}

const DarkToggle = (): JSX.Element => {
  return (
    <div class="flex flex-row p-2 space-x-2 rounded-full border bdr-gray-400">
      <Icon path={moonSolid} class="txt-gray-900" style="width: 24px" />
      <Icon path={sunOutline} class="txt-gray-400" style="width: 24px" />
    </div>
  )
}

export default Header
