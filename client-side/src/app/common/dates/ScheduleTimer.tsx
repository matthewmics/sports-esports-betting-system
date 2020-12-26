import React, { Fragment, useEffect } from 'react'
import { Icon } from 'semantic-ui-react';

export const ScheduleTimer: React.FC<{ date: Date, expirationMessage?: string }> =
    ({ date, expirationMessage }) => {

        const ref = React.createRef<HTMLSpanElement>();

        expirationMessage = expirationMessage ? expirationMessage : 'About to start soon';

        var timer = setInterval(function () {

            var now = new Date().getTime();

            var distance = date.getTime() - now;

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let result = '';
            if (days !== 0)
                result += days + "d ";
            if (hours !== 0)
                result += hours + "h ";
            if (minutes !== 0)
                result += minutes + "m ";

            result += seconds + "s from now";

            if (distance < 0) {
                clearInterval(timer);
                result = expirationMessage as string
            }

            ref.current!.innerHTML = result;

        }, 1000);

        useEffect(() => {

            if (ref.current) {
                ref.current.innerHTML = "Calculating time...";
            }

            return (() => {
                clearInterval(timer);
            })
        }, [timer, ref]);

        return (
            <span>
                <Fragment>
                    <Icon name='clock outline' /> <span ref={ref}></span>
                </Fragment>
            </span>
        )
    }
