import { Coord, Posix, SiliTime, SunData } from "@app/model"
import { SunDataState } from "@app/state"

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

type OptionDataItemProps<T> = {
  labelText: string
  dataAccessor: Accessor<Option.Option<T>>
  dataToText: (value: T) => string
}
const OptionDataItem = <T extends unknown>({
  labelText,
  dataAccessor,
  dataToText,
}: OptionDataItemProps<T>): JSX.Element => {
  return (
    <div>
      <label class={labelStyle}>{labelText}</label>
      {pipe(
        dataAccessor(),
        Option.map(dataToText),
        Option.map(valueText => <p class={valueStyle}>{valueText}</p>),
        Option.getOrElse(() => <Loading />),
      )}
    </div>
  )
}

type FooterProps = {
  now: Accessor<Posix.Posix>
  location: Accessor<Option.Option<Coord.Coord>>
}
const Footer = ({ now, location }: FooterProps): JSX.Element => {
  return (
    <div class="p-4 w-full border-t bdr-gray-400">
      <div class="grid gap-y-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <DataItem
          labelText="train time"
          dataAccessor={now}
          dataToText={nowToTrainTimeText}
        />

        <DataItem
          labelText="epoch"
          dataAccessor={now}
          dataToText={nowToEpochText}
        />

        <OptionDataItem
          labelText="Latitude"
          dataAccessor={location}
          dataToText={Coord.showLat}
        />

        <OptionDataItem
          labelText="Longitude"
          dataAccessor={location}
          dataToText={Coord.showLng}
        />

        <OptionDataItem
          labelText="Sunrise (train)"
          dataAccessor={SunDataState.sunData}
          dataToText={SunData.showSunrise}
        />

        <OptionDataItem
          labelText="Sunset (train)"
          dataAccessor={SunDataState.sunData}
          dataToText={SunData.showSunset}
        />

        <OptionDataItem
          labelText="Hours / Leg"
          dataAccessor={SunDataState.sunData}
          dataToText={legsAnHourText}
        />

        <OptionDataItem
          labelText="Hours / Neg"
          dataAccessor={SunDataState.sunData}
          dataToText={negsAnHourText}
        />
      </div>
    </div>
  )
}

export default Footer
