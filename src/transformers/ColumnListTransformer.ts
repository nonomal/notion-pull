import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { ListBlockChildrenResponseResult } from "notion-to-md/build/types";
import { getBlockChildren } from "./CustomTransformers";

export async function notionColumnListToMarkdown(
  notionToMarkdown: NotionToMarkdown,
  notionClient: Client,
  block: ListBlockChildrenResponseResult
): Promise<string> {
  // Enhance: The @notionhq/client, which uses the official API, cannot yet get at column formatting information (column_ratio)
  // However https://github1s.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/block.tsx#L528 can get it.
  const { id, has_children } = block as any; // "any" because the notion api type system is complex with a union that don't know how to help TS to cope with

  if (!has_children) return "";

  const column_list_children = await getBlockChildren(notionClient, id, 100);

  const column_list_promise = column_list_children.map(
    async column => await notionToMarkdown.blockToMarkdown(column)
  );

  const columns: string[] = await Promise.all(column_list_promise);

  return `<div class='notion-row'>\n${columns.join("\n\n")}\n</div>`;
}
