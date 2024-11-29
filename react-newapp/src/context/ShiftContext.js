import React, { createContext, useState, useContext, useEffect } from 'react';

const ShiftContext = createContext();

export const useShiftContext = () => useContext(ShiftContext);

export const ShiftProvider = ({ children }) => {
    const [monthStats, setMonthStats] = useState({
        workdays: 0,
        dayoffs: 0,
        holidays: 0,
        shifts: 0,
        regularHours: 0,    // Обычные часы
        holidayHours: 0     // Праздничные часы (×1.5)
    });

    // Устанавливаем начало цикла на 30 ноября 2024 (рабочий день)
    const cycleStart = new Date(2024, 10, 30);
    const cycleDays = 4;

    const holidays = [
        { date: '01-01', name: "Новый год" },
        { date: '01-02', name: "Новый год" },
        { date: '03-08', name: "Международный женский день" },
        { date: '03-21', name: "Наурыз мейрамы" },
        { date: '03-22', name: "Наурыз мейрамы" },
        { date: '03-23', name: "Наурыз мейрамы" },
        { date: '05-01', name: "Праздник единства народа Казахстана" },
        { date: '05-07', name: "День защитника Отечества" },
        { date: '05-09', name: "День Победы" },
        { date: '06-28', name: "День журналистики" },
        { date: '07-06', name: "День Столицы" },
        { date: '08-30', name: "День Конституции" },
        { date: '12-16', name: "День независимости" },
    ];

    const isWorkdayBySchedule = (date) => {
        const diffTime = date.getTime() - cycleStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const dayInCycle = ((diffDays % cycleDays) + cycleDays) % cycleDays;
        return dayInCycle < 2;
    };

    const getHolidayName = (date) => {
        const formattedDate = `${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
        const holiday = holidays.find((h) => h.date === formattedDate);
        return holiday ? holiday.name : null;
    };

    const getDayStatus = (date) => {
        const holidayName = getHolidayName(date);
        const isWorkday = isWorkdayBySchedule(date);

        if (holidayName) {
            if (isWorkday) {
                return { 
                    type: 'workday', 
                    message: 'Рабочий день',
                    isHoliday: true,
                    isWorkday: true,
                    holidayName: holidayName
                };
            } else {
                return { 
                    type: 'holiday', 
                    message: holidayName,
                    isHoliday: true,
                    isWorkday: false
                };
            }
        }

        return {
            type: isWorkday ? 'workday' : 'dayoff',
            message: isWorkday ? 'Рабочий день' : 'Выходной',
            isHoliday: false,
            isWorkday: isWorkday
        };
    };

    const calculateMonthStats = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let workdays = 0;
        let dayoffs = 0;
        let holidays = 0;
        let shifts = 0;
        let regularHours = 0;
        let holidayHours = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const status = getDayStatus(date);

            if (status.isWorkday) {
                shifts++;
                if (status.isHoliday) {
                    // Праздничный рабочий день - считаем как обычный рабочий день в календаре
                    workdays++;
                    // Но часы считаем как праздничные для расчета зарплаты
                    holidayHours += 11;
                } else {
                    // Обычный рабочий день
                    workdays++;
                    regularHours += 11;
                }
            } else {
                if (status.isHoliday) {
                    holidays++;
                } else {
                    dayoffs++;
                }
            }
        }

        setMonthStats({
            workdays,
            dayoffs,
            holidays,
            shifts,
            regularHours,
            holidayHours
        });
    };

    useEffect(() => {
        const now = new Date();
        calculateMonthStats(now.getFullYear(), now.getMonth());
    }, []);

    const updateStats = () => {
        const now = new Date();
        calculateMonthStats(now.getFullYear(), now.getMonth());
    };

    return (
        <ShiftContext.Provider value={{
            monthStats,
            getDayStatus,
            updateStats,
            isShiftDay: isWorkdayBySchedule
        }}>
            {children}
        </ShiftContext.Provider>
    );
};
