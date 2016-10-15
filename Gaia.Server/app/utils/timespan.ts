
module Gaia.Utils {

    export class TimeSpan {
        Hours: number = 0;
        Minutes: number = 0;
        Seconds: number = 0;
        Milliseconds: number = 0;

        add(value: TimeSpan): TimeSpan {
            if (!value) return this;

            return new TimeSpan(this.totalMilliseconds() + value.totalMilliseconds());
        }

        subtract(value: TimeSpan): TimeSpan {
            if (!value) return this;

            return new TimeSpan(this.totalMilliseconds() - value.totalMilliseconds());
        }

        totalMilliseconds(): number {
            return (((((this.Hours * 60) + this.Minutes) * 60) + this.Seconds) * 1000) + this.Milliseconds;
        }

        constructor(milisecs?: number) {

            if (milisecs) {
                var value = milisecs;

                //mili seconds
                this.Milliseconds = value % 1000;
                value = Math.ceil((value - this.Milliseconds) / 1000);

                //seconds
                this.Seconds = value % 60;
                value = Math.ceil((value - this.Seconds) / 60);

                //minutes
                this.Minutes = value % 60;
                value = Math.ceil((value - this.Minutes) / 60);

                //hours
                this.Hours = value % 60;
            }
        }
    }
}