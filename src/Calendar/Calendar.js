import PropTypes from "prop-types";
import classNames from "classnames";
import {
    daysOfWeek,
    createDaysForCurrentMonth,
    createDaysForNextMonth,
    createDaysForPreviousMonth,
    isWeekendDay,
    getMonthDropdownOptions,
    getYearDropdownOptions,
} from "./Helpers";
import InfoModal from "../SongView/InfoModal";
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebaseConfig";

Calendar.propTypes = {
    className: PropTypes.string,
    yearAndMonth: PropTypes.arrayOf(PropTypes.number).isRequired, // e.g. [2021, 6] for June 2021
    onYearAndMonthChange: PropTypes.func.isRequired,
    renderDay: PropTypes.func,
};
export default function Calendar({
                                     yearAndMonth = [2021, 11],
                                     onYearAndMonthChange,
                                     renderDay = () => null,
                                 }) {
    const [year, month] = yearAndMonth;
    const [selectedDate, setSelectedDate] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [monthData, setMonthData] = useState([]);

    let currentMonthDays = createDaysForCurrentMonth(year, month);
    let previousMonthDays = createDaysForPreviousMonth(
        year,
        month,
        currentMonthDays
    );
    let nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);
    let calendarGridDayObjects = [
        ...previousMonthDays,
        ...currentMonthDays,
        ...nextMonthDays,
    ];

    const handleMonthNavBackButtonClick = () => {
        let nextYear = year;
        let nextMonth = month - 1;
        if (nextMonth === 0) {
            nextMonth = 12;
            nextYear = year - 1;
        }
        onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleMonthNavForwardButtonClick = () => {
        let nextYear = year;
        let nextMonth = month + 1;
        if (nextMonth === 13) {
            nextMonth = 1;
            nextYear = year + 1;
        }
        onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleMonthSelect = (evt) => {
        let nextYear = year;
        let nextMonth = parseInt(evt.target.value, 10);
        onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleYearSelect = (evt) => {
        let nextMonth = month;
        let nextYear = parseInt(evt.target.value, 10);
        onYearAndMonthChange([nextYear, nextMonth]);
    };

    const closeModal = async () => {
        setSelectedDate("");
        setModalVisible(false);
        await loadMonthData();
    };

    useEffect(() => {
        async function awaitData() {
            await loadMonthData();
        }

        awaitData();
    }, []);

    const loadMonthData = async () => {
        let monthData = [];
        const querySnapshot = await getDocs(collection(db, "memories"));
        querySnapshot.forEach((doc) => {
            if (doc.data().date) {
                monthData.push(doc.data());
            }
        });
        setMonthData(monthData);
    };

    const divStyle = (dateString) => {
        const a = monthData.filter((data) => data.date === dateString);
        if (a.length > 0) {
            let image = a[0].cover_url != null ? "url(" + a[0].cover_url + ")" : "url(" + a[0].episode_photo + ")";
            return {
                backgroundImage: image,
                backgroundSize: "cover",
            };
        }
    };

    return (
        <div className="calendar-root">
            <div className="navigation-header mt-2">
                <div className="month-nav-arrow-buttons">
                    <button
                        className="btn btn-outline-dark p-1 m-1"
                        onClick={handleMonthNavBackButtonClick}
                    >
                        poprzedni
                    </button>
                    <button
                        className="btn btn-outline-dark p-1"
                        onClick={handleMonthNavForwardButtonClick}
                    >
                        następny
                    </button>
                </div>
                <div>
                    <select
                        className="month-select"
                        value={month}
                        onChange={handleMonthSelect}
                    >
                        {getMonthDropdownOptions().map(({label, value}) => (
                            <option value={value} key={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <select
                        className="year-select"
                        value={year}
                        onChange={handleYearSelect}
                    >
                        {getYearDropdownOptions(year).map(({label, value}) => (
                            <option value={value} key={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="days-of-week">
                {daysOfWeek.map((day, index) => (
                    <div
                        key={day}
                        className={classNames("day-of-week-header-cell", {
                            "weekend-day": [6, 0].includes(index),
                        })}
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="days-grid">
                {calendarGridDayObjects.map((day) => (
                    <div
                        key={day.dateString}
                        className={classNames("day-grid-item-container", {
                            "weekend-day": isWeekendDay(day.dateString),
                            "current-month": day.isCurrentMonth,
                        })}
                        style={divStyle(day.dateString)}
                    >
                        <div
                            className="day-content-wrapper"
                            onClick={() => {
                                setSelectedDate(day.dateString);
                                setModalVisible(true);
                            }}
                        >
                            {renderDay(day)}
                        </div>
                    </div>
                ))}
            </div>
            <InfoModal
                date={selectedDate}
                isVisible={isModalVisible}
                closeModal={() => closeModal()}
            />
        </div>
    );
}

CalendarDayHeader.propTypes = {
    calendarDayObject: PropTypes.object.isRequired,
};

export function CalendarDayHeader({calendarDayObject}) {
    return (
        <div className="day-grid-item-header">
            <div className="day-text-div">{calendarDayObject.dayOfMonth}</div>
        </div>
    );
}
