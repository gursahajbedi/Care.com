import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

const StatisticsCounter = ({ mothersHelped, nanniesProvided }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [mothersInViewRef, mothersInView] = useInView({ threshold: 0 });
    const [nanniesInViewRef, nanniesInView] = useInView({ threshold: 0 });

    useEffect(() => {
        if (mothersInView || nanniesInView) {
            setIsVisible(true);
        }
    }, [mothersInView, nanniesInView]);

    const mothersProps = useSpring({
        number: isVisible ? mothersHelped : 0,
        from: { number: 0 },
        delay: 500,
    });
    const nanniesProps = useSpring({
        number: isVisible ? nanniesProvided : 0,
        from: { number: 0 },
        delay: 500,
    });

    const mothersPercentage = Math.min((mothersProps.number / mothersHelped) * 100, 100);
    const nanniesPercentage = Math.min((nanniesProps.number / nanniesProvided) * 100, 100);

    return (
        <div className="flex flex-col justify-center items-center mx-auto max-w-2xl my-12">
            <div className="text-5xl font-semibold mb-8 text-center">Our Impact</div>
            <hr className="w-full border-2 border-gray-200 mb-8" />
            <div className="flex items-center justify-center">
                <div
                    ref={mothersInViewRef}
                    className="mr-12 text-4xl text-red-400 font-semibold relative"
                >
                    Mothers Helped:{' '}
                    <animated.span className="font-bold">
                        {mothersProps.number.interpolate((val) => Math.floor(val))}
                    </animated.span>
                    <div className="h-1 bg-red-200 w-full absolute bottom-0 left-0">
                        <div
                            className="h-full bg-red-600"
                            style={{ width: `${mothersPercentage}%` }}
                        ></div>
                    </div>
                </div>
                <div ref={nanniesInViewRef} className="text-4xl text-blue-600 font-semibold relative">
                    Nannies Provided Jobs:{' '}
                    <animated.span className="font-bold">
                        {nanniesProps.number.interpolate((val) => Math.floor(val))}
                    </animated.span>
                    <div className="h-1 bg-blue-200 w-full absolute bottom-0 left-0">
                        <div
                            className="h-full bg-blue-600"
                            style={{ width: `${nanniesPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsCounter;