export interface WidgetMetadata {
  id: string;
  slug: string;
  title: string;
  fileName: string;
  filePath: string;
  category: string;
  categorySegments: string[];
  rawHtml: string;
  description?: string;
}

export type WidgetTreeNode = WidgetFolderNode | WidgetLeafNode;

export interface WidgetFolderNode {
  type: 'folder';
  name: string;
  path: string;
  children: WidgetTreeNode[];
  widgetCount: number;
}

export interface WidgetLeafNode {
  type: 'file';
  name: string;
  widget: WidgetMetadata;
}
