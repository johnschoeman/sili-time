import {
  Coord,
  NumberBase,
  Posix,
  RemoteData,
  SiliTime,
  SunData,
} from "@app/model"
import {
  LocationState,
  NowState,
  NumberBaseState,
  SunDataState,
} from "@app/state"

import { pipe, String } from "effect"
import { Accessor, JSX } from "solid-js"

const nowToEpochText =
  (base: Accessor<NumberBase.NumberBase>) =>
  (now: Posix.Posix): string => {
    return pipe(now, NumberBase.toPercision(base())(10))
  }

const nowToTrainTimeText = (now: Posix.Posix): string => {
  return Posix.toDate(now)
}

const legsAnHourText =
  (base: Accessor<NumberBase.NumberBase>) =>
  (sunData_: SunData.SunData): string => {
    const legAnHour = 1 / SiliTime.legAnHour(sunData_)
    return pipe(legAnHour, NumberBase.toPercision(base())(4))
  }
const negsAnHourText =
  (base: Accessor<NumberBase.NumberBase>) =>
  (sunData_: SunData.SunData): string => {
    const negAnHour = 1 / SiliTime.negAnHour(sunData_)
    return pipe(negAnHour, NumberBase.toPercision(base())(4))
  }

const Loading = (): JSX.Element => {
  return <p>...</p>
}

const labelStyle = ""
const valueStyle = "font-semibold"

type DataItemProps<T> = {
  labelText: string
  dataAccessor: Accessor<T>
  dataToText: (value: T) => string
}
const DataItem = <T extends unknown>({
  labelText,
  dataAccessor,
  dataToText,
}: DataItemProps<T>): JSX.Element => {
  return (
    <div>
      <label class={labelStyle}>{labelText}</label>
      {pipe(dataAccessor(), dataToText, valueText => (
        <p class={valueStyle}>{valueText}</p>
      ))}
    </div>
  )
}

type RemoteDataItemProps<T, E> = {
  labelText: string
  dataAccessor: Accessor<RemoteData.RemoteData<T, E>>
  dataToText: (value: T) => string
}
const RemoteDataItem = <T extends unknown, E>({
  labelText,
  dataAccessor,
  dataToText,
}: RemoteDataItemProps<T, E>): JSX.Element => {
  return (
    <div>
      <label class={labelStyle}>{labelText}</label>
      {pipe(
        dataAccessor(),
        RemoteData.map(dataToText),
        RemoteData.map(valueText => <p class={valueStyle}>{valueText}</p>),
        RemoteData.match({
          onResolved: valueText => <p class={valueStyle}>{valueText}</p>,
          onNotStarted: () => <p>not started</p>,
          onInFlight: () => <Loading />,
          onRequestError: error => <p>{`${error}`}</p>,
        }),
      )}
    </div>
  )
}

const Footer = (): JSX.Element => {
  const base = NumberBaseState.numberBase

  return (
    <div class="p-4 w-full border-t bdr-gray-400">
      <div class="grid gap-y-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <DataItem
          labelText="train time"
          dataAccessor={NowState.now}
          dataToText={nowToTrainTimeText}
        />

        <DataItem
          labelText="epoch"
          dataAccessor={NowState.now}
          dataToText={nowToEpochText(base)}
        />

        <RemoteDataItem
          labelText="Latitude"
          dataAccessor={LocationState.location}
          dataToText={Coord.showLat}
        />

        <RemoteDataItem
          labelText="Longitude"
          dataAccessor={LocationState.location}
          dataToText={Coord.showLng}
        />

        <RemoteDataItem
          labelText="Sunrise (train)"
          dataAccessor={SunDataState.sunData}
          dataToText={SunData.showSunrise}
        />

        <RemoteDataItem
          labelText="Sunset (train)"
          dataAccessor={SunDataState.sunData}
          dataToText={SunData.showSunset}
        />

        <RemoteDataItem
          labelText="Hours / Leg"
          dataAccessor={SunDataState.sunData}
          dataToText={legsAnHourText(base)}
        />

        <RemoteDataItem
          labelText="Hours / Neg"
          dataAccessor={SunDataState.sunData}
          dataToText={negsAnHourText(base)}
        />
      </div>
    </div>
  )
}

export default Footer
