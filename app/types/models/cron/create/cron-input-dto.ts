import type { ICronDailyInputDto } from "./daily/cronDaily-input-dto"
import type { ICronHourlyInputDto } from "./hourly/cronHourly-input-dto"
import type { ICronMinuteInputDto } from "./minute/cronMinute-input-dto"
import type { ICronMonthlyDayInputDto } from "./monthlyDay/cronMonthlyDay-input-dto"
import type { ICronMonthlyWeekInputDto } from "./monthlyWeek/cronMonthlyWeek-input-dto"
import type { ICronWeeklyInputDto } from "./weekly/cronWeekly-input-dto"

export interface ICronInputDto { 
    timeZone: string
    minute: ICronMinuteInputDto
    hourly: ICronHourlyInputDto
    daily: ICronDailyInputDto
    weekly: ICronWeeklyInputDto
    monthlyDay: ICronMonthlyDayInputDto
    monthlyWeek: ICronMonthlyWeekInputDto
    cron: string
}
