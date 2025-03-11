import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { type FC, type RefObject } from 'react';

import styles from './Select/index.module.css';

type SelectScrollButtonProps = {
  direction: 'up' | 'down';
  scrollContainerRef?: RefObject<HTMLElement>;
  scrollAmount?: number;
  scrollInterval?: number;
};

const SelectScrollButton: FC<SelectScrollButtonProps> = ({
  direction,
  scrollContainerRef,
  scrollAmount = 5,
  scrollInterval = 50,
}) => {
  const DirectionComponent =
    direction === 'down' ? ChevronDownIcon : ChevronUpIcon;
  const [isScrolling, setIsScrolling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Check if scrolling in the given direction is possible
  useEffect(() => {
    if (!scrollContainerRef?.current) return;

    const container = scrollContainerRef.current;

    const checkScrollability = () => {
      if (!container) return;

      if (direction === 'down') {
        console.log(
          container.scrollTop,
          container.scrollHeight,
          container.clientHeight
        );
        setIsVisible(
          container.scrollTop < container.scrollHeight - container.clientHeight
        );
      } else {
        setIsVisible(container.scrollTop > 0);
      }
    };

    checkScrollability();

    const handleScroll = () => checkScrollability();
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkScrollability);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [direction, scrollContainerRef]);

  // Scrolling effect
  useEffect(() => {
    if (isScrolling && isVisible && scrollContainerRef?.current) {
      console.log('scrolling...', scrollContainerRef?.current);
      intervalRef.current = window.setInterval(() => {
        if (scrollContainerRef.current) {
          if (direction === 'down') {
            const container = scrollContainerRef.current;
            // container.scrollTop += scrollAmount;
            container.scrollBy({ top: 25, behavior: 'smooth' });

            if (
              container.scrollTop >=
              container.scrollHeight - container.clientHeight
            ) {
              setIsScrolling(false);
              setIsVisible(false);
            }
          } else {
            const container = scrollContainerRef.current;
            container.scrollTop -= scrollAmount;

            if (container.scrollTop <= 0) {
              setIsScrolling(false);
              setIsVisible(false);
            }
          }
        }
      }, scrollInterval);
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isScrolling,
    isVisible,
    direction,
    scrollContainerRef,
    scrollAmount,
    scrollInterval,
  ]);

  // if (!isVisible) return null;

  return (
    <div
      className={styles.scrollBtn}
      data-direction={direction}
      onMouseEnter={() => setIsScrolling(true)}
      onMouseLeave={() => setIsScrolling(false)}
    >
      <DirectionComponent className={styles.scrollBtnIcon} aria-hidden="true" />
    </div>
  );
};

export default SelectScrollButton;
