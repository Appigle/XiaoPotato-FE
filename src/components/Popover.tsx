import { HelpCircle, LucideIcon } from 'lucide-react';
import React, { ElementType, useEffect, useRef, useState } from 'react';

type Placement = 'top' | 'bottom' | 'left' | 'right';
type Trigger = 'click' | 'hover' | 'both';

interface PopoverStyles {
  bottom?: string | number;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  transform?: string;
  marginTop?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
}

interface ArrowStyles extends PopoverStyles {
  borderLeft?: string;
  borderRight?: string;
  borderTop?: string;
  borderBottom?: string;
}

type ChildComponent = ElementType | LucideIcon;

// Props specific to the child/trigger component
interface ChildProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow any other props to be passed to the child
}

interface PopoverProps {
  child?: ChildComponent;
  childProps?: ChildProps;
  placement?: Placement;
  trigger?: Trigger;
  content: React.ReactNode;
  containerClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  hideArrow?: boolean;
}

const ARROW_SIZE = 8;
const SPACING = 8;

const Popover: React.FC<PopoverProps> = ({
  child: ChildComponent = HelpCircle,
  childProps = {},
  placement = 'top',
  trigger = 'hover',
  content,
  containerClassName = '',
  popoverClassName = 'w-64',
  disabled = false,
  onOpen,
  onClose,
  hideArrow = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popoverStyles, setPopoverStyles] = useState<PopoverStyles>({});
  const [arrowStyles, setArrowStyles] = useState<ArrowStyles>({});

  const iconRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = (): void => {
    if (!iconRef.current || !popoverRef.current) return;

    // const iconRect = iconRef.current.getBoundingClientRect();
    // const popoverRect = popoverRef.current.getBoundingClientRect();
    // const viewportHeight = window.innerHeight;
    // const viewportWidth = window.innerWidth;

    let popoverStyle: PopoverStyles = {};
    let arrowStyle: ArrowStyles = {};

    // Default positions for each placement
    const positions = {
      top: {
        popover: {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: SPACING,
        },
        arrow: {
          bottom: -ARROW_SIZE,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          borderRight: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
        },
      },
      bottom: {
        popover: {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: SPACING,
        },
        arrow: {
          top: -ARROW_SIZE,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          borderLeft: '1px solid #e5e7eb',
          borderTop: '1px solid #e5e7eb',
        },
      },
      left: {
        popover: {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: SPACING,
        },
        arrow: {
          right: -ARROW_SIZE,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
          borderRight: '1px solid #e5e7eb',
          borderTop: '1px solid #e5e7eb',
        },
      },
      right: {
        popover: {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: SPACING,
        },
        arrow: {
          left: -ARROW_SIZE,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
          borderLeft: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    };

    ({ popover: popoverStyle, arrow: arrowStyle } = positions[placement]);

    setPopoverStyles(popoverStyle);
    setArrowStyles(arrowStyle);
  };

  const handleOpen = (): void => {
    if (!disabled) {
      setIsOpen(true);
      onOpen?.();
    }
  };

  const handleClose = (): void => {
    setIsOpen(false);
    onClose?.();
  };

  const handleClick = (e: React.MouseEvent): void => {
    if (trigger === 'click' || trigger === 'both') {
      e.stopPropagation();
      if (isOpen) {
        handleClose();
      } else {
        handleOpen();
      }
    }
  };

  const handleMouseEnter = (): void => {
    if (trigger === 'hover' || trigger === 'both') {
      clearTimeout(timeoutRef.current);
      handleOpen();
    }
  };

  const handleMouseLeave = (): void => {
    if (trigger === 'hover' || trigger === 'both') {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, 200);
    }
  };

  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      const handleResize = (): void => {
        requestAnimationFrame(calculatePosition);
      };

      const handleClickOutside = (e: MouseEvent): void => {
        if (
          trigger !== 'hover' &&
          popoverRef.current &&
          !popoverRef.current.contains(e.target as Node) &&
          iconRef.current &&
          !iconRef.current.contains(e.target as Node)
        ) {
          handleClose();
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('click', handleClickOutside);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen, placement, trigger]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative inline-block ${containerClassName}`}>
      <div
        ref={iconRef}
        className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-disabled={disabled}
        role={trigger === 'click' ? 'button' : undefined}
        tabIndex={trigger === 'click' ? 0 : undefined}
      >
        <ChildComponent
          {...childProps}
          className={`${childProps.className || ''} ${disabled ? 'opacity-50' : ''}`}
          aria-hidden="true"
        />
      </div>

      {isOpen && !disabled && (
        <div
          ref={popoverRef}
          role="tooltip"
          className={`absolute z-10 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-lg ${popoverClassName}`}
          style={popoverStyles}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!hideArrow && (
            <div className="absolute h-4 w-4 bg-white" style={arrowStyles} aria-hidden="true" />
          )}
          <div className="relative z-10">
            <div className="text-sm text-gray-600">{content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// // Example usage
// const Example: React.FC = () => {
//   // Custom button component example
//   const CustomButton: React.FC<{ className?: string }> = ({ className }) => (
//     <button className={`rounded bg-blue-500 px-3 py-1 text-white ${className}`}>Info</button>
//   );

//   return (
//     <div className="flex items-center justify-around space-x-8 p-20">
//       {/* Using Lucide child */}
//       <Popover content="Default HelpCircle child" />

//       {/* Using custom child props */}
//       <Popover
//         child={HelpCircle}
//         childProps={{
//           className: 'w-6 h-6 text-blue-500',
//           strokeWidth: 3,
//         }}
//         content="Customized Lucide child"
//         trigger="click"
//       />

//       {/* Using custom component */}
//       <Popover
//         child={CustomButton}
//         childProps={{
//           className: 'hover:bg-blue-600',
//         }}
//         content="Custom button trigger"
//         trigger="both"
//       />

//       {/* Using native HTML element */}
//       <Popover
//         child="div"
//         childProps={{
//           className: 'w-6 h-6 bg-red-500 rounded-full hover:bg-red-600',
//         }}
//         content="HTML element as trigger"
//         hideArrow
//       />
//     </div>
//   );
// };

export default Popover;
