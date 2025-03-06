import { useTableSelection } from "@/features/erd/hooks";
import type { TableNodeType } from "@/features/erd/types";
import { selectTableLogEvent } from "@/features/gtm/utils";
import { useVersion } from "@/providers";
import { SidebarMenuButton, SidebarMenuItem, Table2 } from "@liam-hq/ui";
import clsx from "clsx";
import { type FC, useEffect, useRef, useState } from "react";
import styles from "./TableNameMenuButton.module.css";
import { VisibilityButton } from "./VisibilityButton";

type Props = {
  node: TableNodeType;
};

export const TableNameMenuButton: FC<Props> = ({ node }) => {
  const name = node.data.table.name;

  const { selectTable } = useTableSelection();
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState<boolean>(false)

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current
        const isTruncated = element.scrollWidth > element.clientWidth
        setIsTruncated(isTruncated)
      }
    }

    // Initial check after a small delay to ensure DOM is rendered
    const timeoutId = setTimeout(checkTruncation, 0)

    // Check on window resize and when sidebar width changes
    window.addEventListener('resize', checkTruncation)

    // Add a mutation observer to watch for width changes
    const observer = new ResizeObserver(checkTruncation)
    if (textRef.current) {
      observer.observe(textRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkTruncation)
      observer.disconnect()
    }
  }, [name])

  // TODO: Move handleClickMenuButton outside of TableNameMenuButton
  // after logging is complete
  const { version } = useVersion();
  const handleClickMenuButton = (tableId: string) => () => {
    selectTable({
      tableId,
      displayArea: "main",
    });

    selectTableLogEvent({
      ref: "leftPane",
      tableId,
      platform: version.displayedOn,
      gitHash: version.gitHash,
      ver: version.version,
      appEnv: version.envName,
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={clsx(
          styles.button,
          node.data.isActiveHighlighted && styles.active
        )}
        asChild
      >
        <div
          // biome-ignore lint/a11y/useSemanticElements: Implemented with div button to be button in button
          role="button"
          tabIndex={0}
          onClick={handleClickMenuButton(name)}
          onKeyDown={handleClickMenuButton(name)}
          aria-label={`Menu button for ${name}`}
        >
          <Table2 size="10px" />

          <span ref={textRef} className={styles.tableName}>
            {name}
          </span>

          <VisibilityButton tableName={name} hidden={node.hidden} />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
