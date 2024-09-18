import { pipe } from "effect"
import { JSX } from "solid-js"

import { NumberBase, Posix, RemoteData, SiliTime, SunData } from "@app/model"
import { NowState, NumberBaseState, SunDataState } from "@app/state"

import Header from "../Header"
import Footer from "./Footer"

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
    <>
      <Header />

      <div class="font-mono h-full">
        <div class="px-4 h-full flex flex-col justify-center items-center">
          <div>
            <div class="text-5xl md:text-7xl lg:text-9xl font-black mb-2">
              {pipe(
                SunDataState.sunData(),
                RemoteData.match({
                  onResolved: sunData_ => (
                    <p class="txt-gray-900">{siliTimeText(sunData_)}</p>
                  ),
                  onNotStarted: () => (
                    <p class="txt-gray-400 animate-pulse">L:00:00:00</p>
                  ),
                  onInFlight: () => (
                    <p class="txt-gray-400 animate-pulse">L:00:00:00</p>
                  ),
                  onRequestError: error => (
                    <p class="txt-gray-400">{`${error}`}</p>
                  ),
                }),
              )}
            </div>

            <div class="flex justify-end">
              <p class="font-bold txt-gray-800 text-lg md:text-2xl lg:text-4xl">
                {pipe(
                  SunDataState.sunData(),
                  RemoteData.match({
                    onResolved: sunData_ => (
                      <p class="txt-gray-900">
                        {percentCompletedText(sunData_)}
                      </p>
                    ),
                    onNotStarted: () => (
                      <p class="txt-gray-400 animate-pulse">00.00%</p>
                    ),
                    onInFlight: () => (
                      <p class="txt-gray-400 animate-pulse">00.00%</p>
                    ),
                    onRequestError: error => (
                      <p class="txt-gray-400">{`${error}`}</p>
                    ),
                  }),
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default SiliTimeView
