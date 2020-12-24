import React, { Fragment, useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react';

export const ScheduleTimer: React.FC<{ date: Date, expirationMessage?: string }> =
    ({ date, expirationMessage }) => {

        expirationMessage = expirationMessage ? expirationMessage : 'About to start soon';

        const [displayText, setDisplayText] = useState('');

        var timer = setInterval(function () {

            var now = new Date().getTime();

            var distance = date.getTime() - now;

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let result = '';
            if (days != 0)
                result += days + "d ";
            if (hours != 0)
                result += hours + "h ";
            if (minutes != 0)
                result += minutes + "m ";

            result += seconds + "s from now";

            if (distance < 0) {
                clearInterval(timer);
                result = expirationMessage as string
            }

            setDisplayText(result);

        }, 1000);

        useEffect(() => {
            return (() => {
                clearInterval(timer);
            })
        }, [timer]);

        return (
            <span>

                {displayText &&
                    <Fragment>
                        <Icon name='clock outline' /> {displayText}
                    </Fragment>
                }
            </span>
        )
    }
