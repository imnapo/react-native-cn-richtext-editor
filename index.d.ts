export as namespace CNRichTextEditor;

import { Component, ReactNode } from "react";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

export interface CNRichTextEditorProps {
  onSelectedTagChanged?: (tag: string) => void;
  onSelectedStyleChanged?: (styles: string[]) => void;
  onValueChanged?: (value: object[]) => void;
  onRemoveImage?: (url: string, id: string) => void;
  value: ReturnType<typeof getInitialObject>;
  styleList: any;
  ImageComponent?: React.ReactElement<any, any>;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder: string;
  textInputStyle?: StyleProp<TextStyle>;
}

export default class CNRichTextEditor extends Component<CNRichTextEditorProps> {
  applyToolbar(toolType: any): void;
  insertImage(uri: any, id?: any, height?: number, width?: number): void;
  focus(): void;
}

export interface CNToolbarProps {
  selectedTag: string;
  selectedStyles: string[];
  onStyleKeyPress: (toolType: any) => void;
  size?: number;
  iconSet?:any[];
  iconSetContainerStyle: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  color?: string;
  backgroundColor?: string;
  selectedBackgroundColor?: string;
  iconContainerStyle?: StyleProp<ViewStyle>;
}

export class CNToolbar extends Component<CNToolbarProps> {}

export interface CNRichTextViewProps {
  text: string;
  style?: StyleProp<ViewStyle>;
  styleList: ReturnType<typeof StyleSheet.create>;
}

export class CNRichTextView extends Component<CNRichTextViewProps> {}

export function getInitialObject(): any;
export function convertToHtmlString(html: object[]): string;
export function convertToObject(html: string): object[];
export function getDefaultStyles(): ReturnType<typeof StyleSheet.create>;
