import { ChainIcon } from '@decent.xyz/box-ui';
import { ChainId, getChainName } from '@decent.xyz/box-common';
import { cn } from '../../../utils/utils';

export const ChainPillButton = ({
  chain,
  onClick,
  selected,
  children,
}: {
  chain?: ChainId;
  onClick: () => void;
  selected: boolean;
  children?: React.ReactNode;
}) => {
  if (!chain && !children) return;
  return (
    <button
      onClick={() => {
        void onClick();
      }}
      className={cn(
        'aw-flex aw-h-[40px] aw-items-center aw-justify-center aw-gap-2 aw-rounded-[55px] aw-bg-apeBlue aw-pl-2 aw-pr-2.5 aw-py-1 hover:aw-bg-apeDarkBlue aw-border aw-transition-all aw-duration-300 aw-ease-in-out',
        selected ? 'aw-border-white/50' : 'aw-border-transparent',
      )}
    >
      {children ?? (
        <>
          <ChainIcon chainId={chain} className={'aw-aspect-square aw-size-6'} />
          <div className="aw-text-center aw-font-dmmono aw-text-sm aw-font-medium aw-uppercase aw-leading-[14px] aw-tracking-wide aw-text-white">
            {getChainName(chain as ChainId) ?? 'Unknown'}
          </div>
        </>
      )}
    </button>
  );
};
