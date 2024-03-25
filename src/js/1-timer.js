import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate;
let startButton = document.querySelector("button");
let timeInterval; 
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        const currentDate = new Date();
        if (selectedDates[0] <= currentDate) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            startButton.disabled = true;
        }else { 
            startButton.disabled = false;
        }
    },
};

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value < 10 ? `0${value}` : value;
}

flatpickr("#datetime-picker", options);

startButton.addEventListener('click', event => {
    event.preventDefault(); 

    timeInterval = setInterval(() => {
        const remainingTime = userSelectedDate - new Date();

        if (remainingTime <= 0) {
            clearInterval(timeInterval);
            iziToast.success({
                title: 'Countdown Finished',
                message: 'The countdown has finished!',
            });
            startButton.disabled = true;
        } else {
            const { days, hours, minutes, seconds } = convertMs(remainingTime);
            document.querySelector("[data-days]").textContent = addLeadingZero(days); 
            document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
            document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
            document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
        }
    }, 1000);

    startButton.disabled = true; 
});
