import { ICronDailyInputDto } from "./daily/cronDaily-input-dto"
import { ICronHourlyInputDto } from "./hourly/cronHourly-input-dto"
import { ICronMinuteInputDto } from "./minute/cronMinute-input-dto"
import { ICronMonthlyDayInputDto } from "./monthlyDay/cronMonthlyDay-input-dto"
import { ICronMonthlyWeekInputDto } from "./monthlyWeek/cronMonthlyWeek-input-dto"
import { ICronWeeklyInputDto } from "./weekly/cronWeekly-input-dto"

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
