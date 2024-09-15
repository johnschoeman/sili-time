import { Accessor, JSX } from "solid-js"
import { pipe, Option } from "effect"

import { Coord, Posix, SiliTime, SunData } from "@app/model"

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
    c => String(c * 100).slice(0, 4),
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
  sunData: SunData.SunData
  now: Accessor<Posix.Posix>
  displayError: Option.Option<Error>
}
const SiliTimeView = ({
  sunData,
  now,
  displayError,
}: SiliTimeViewProps): JSX.Element => {
  return (
    <div class="flex">
      <div>
        <h1 class="text-5xl md:text-7xl lg:text-9xl font-black mb-2">
          {siliTimeText(sunData, now)}
        </h1>
        <div class="flex justify-end">
          <p class="font-bold txt-gray-800">
            {percentCompletedText(sunData, now)}
          </p>
        </div>
      </div>

      {hasError(displayError) && <p>{displayErrorText(displayError)}</p>}
    </div>
  )
}

export default SiliTimeView
