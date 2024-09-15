import { Posix, SiliTime, SunData } from "@app/model"
import { SunDataState } from "@app/state"

import { Option, pipe } from "effect"
import { Accessor, JSX } from "solid-js"

const siliTimeText = (
  sunData_: SunData.SunData,
  now: Accessor<Posix.Posix>,
): string => {
  return pipe(siliTime(sunData_, now), SiliTime.show)
}

const percentCompletedText = (
  sunData_: SunData.SunData,
  now: Accessor<Posix.Posix>,
): string => {
  return pipe(
    siliTime(sunData_, now),
    SiliTime.percentCompleted,
    c => String(c * 100).slice(0, 5),
    v => `${v}%`,
  )
}

const showError = (error: Error): string => {
  return `${error}`
}

const displayErrorText = (displayError: Option.Option<Error>): string =>
  pipe(displayError, Option.match({ onNone: () => "", onSome: showError }))

const hasError = (displayError: Option.Option<Error>): boolean =>
  pipe(
    displayError,
    Option.map(() => true),
    Option.getOrElse(() => false),
  )

const siliTime = (
  sunData_: SunData.SunData,
  now: Accessor<Posix.Posix>,
): SiliTime.SiliTime => {
  return pipe(
    now(),
    Posix.toDaySecond,
    SiliTime.fromDaySeconds(sunData_),
    SiliTime.fromSet,
  )
}

type SiliTimeViewProps = {
  now: Accessor<Posix.Posix>
  displayError: Option.Option<Error>
}
const SiliTimeView = ({
  now,
  displayError,
}: SiliTimeViewProps): JSX.Element => {
  return (
    <div class="h-full">
      <div class="px-4 h-full flex flex-col justify-center items-center">
        <div>
          <div class="text-5xl md:text-7xl lg:text-9xl font-black mb-2">
            {pipe(
              SunDataState.sunData(),
              Option.map(sunData_ => (
                <p class="txt-gray-900">{siliTimeText(sunData_, now)}</p>
              )),
              Option.getOrElse(() => (
                <p class="txt-gray-400 animate-pulse">L:00:00:00</p>
              )),
            )}
          </div>

          <div class="flex justify-end">
            <p class="font-bold txt-gray-800 text-lg md:text-2xl lg:text-4xl">
              {pipe(
                SunDataState.sunData(),
                Option.map(sunData_ => (
                  <p class="txt-gray-800">
                    {percentCompletedText(sunData_, now)}
                  </p>
                )),
                Option.getOrElse(() => (
                  <p class="txt-gray-400 animate-pulse">00.00%</p>
                )),
              )}
            </p>
          </div>
        </div>
      </div>

      {hasError(displayError) && <p>{displayErrorText(displayError)}</p>}
    </div>
  )
}

export default SiliTimeView
