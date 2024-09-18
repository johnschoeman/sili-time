import { Coord, Posix, RemoteData, SiliTime, SunData } from "@app/model"
import { LocationState, NowState, SunDataState } from "@app/state"

import { Option, pipe } from "effect"
import { Accessor, JSX } from "solid-js"

const nowToEpochText = (now: Posix.Posix): string => {
  return String(now).slice(0, 10)
}

const nowToTrainTimeText = (now: Posix.Posix): string => {
  return Posix.toDate(now)
}

const legsAnHourText = (sunData_: SunData.SunData): string => {
  const legAnHour = 1 / SiliTime.legAnHour(sunData_)
  return String(legAnHour).slice(0, 4)
}
const negsAnHourText = (sunData_: SunData.SunData): string => {
  const negAnHour = 1 / SiliTime.negAnHour(sunData_)
  return String(negAnHour).slice(0, 4)
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
          dataToText={nowToEpochText}
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
          dataToText={legsAnHourText}
        />

        <RemoteDataItem
          labelText="Hours / Neg"
          dataAccessor={SunDataState.sunData}
          dataToText={negsAnHourText}
        />
      </div>
    </div>
  )
}

export default Footer
