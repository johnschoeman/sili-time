import { NumberBase, Posix, SiliTime, SunData } from "@app/model"
import {
  LocationState,
  NowState,
  NumberBaseState,
  SunDataState,
} from "@app/state"

import { Option, pipe } from "effect"
import { JSX } from "solid-js"

const siliTimeText = (sunData_: SunData.SunData): string => {
  return pipe(siliTime(sunData_), SiliTime.show(NumberBaseState.numberBase()))
}

const percentCompletedText = (sunData_: SunData.SunData): string => {
  return pipe(
    siliTime(sunData_),
    SiliTime.percentCompleted,
    NumberBase.toPercentageIn(NumberBaseState.numberBase()),
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

const siliTime = (sunData_: SunData.SunData): SiliTime.SiliTime => {
  return pipe(
    NowState.now(),
    Posix.toDaySecond,
    SiliTime.fromDaySeconds(sunData_),
    SiliTime.fromSet,
  )
}

const SiliTimeView = (): JSX.Element => {
  return (
    <div class="font-mono h-full">
      <div class="px-4 h-full flex flex-col justify-center items-center">
        <div>
          <div class="text-5xl md:text-7xl lg:text-9xl font-black mb-2">
            {pipe(
              SunDataState.sunData(),
              Option.map(sunData_ => (
                <p class="txt-gray-900">{siliTimeText(sunData_)}</p>
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
                  <p class="txt-gray-800">{percentCompletedText(sunData_)}</p>
                )),
                Option.getOrElse(() => (
                  <p class="txt-gray-400 animate-pulse">00.00%</p>
                )),
              )}
            </p>
          </div>
        </div>
      </div>

      {hasError(LocationState.displayError()) && (
        <p>{displayErrorText(LocationState.displayError())}</p>
      )}
    </div>
  )
}

export default SiliTimeView
