export as namespace CNRichTextEditor;

import { number } from "prop-types";
import { Component, ReactNode } from "react";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

export interface CNRichTextEditorProps {
  onSelectedTagChanged?: (tag: string) => void;
  onSelectedStyleChanged?: (styles: ViewStyle[]) => void;
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
  textInputStyle: StyleProp<TextStyle>;
}

export default class CNRichTextEditor extends Component<CNRichTextEditorProps> {
  applyToolbar(toolType: any): void;
  insertImage(uri: any, id?: any, height?: number, width?: number): void;
  focus(): void;
}

export interface CNToolbarProps {
  selectedTag: string;
  selectedStyles: StyleProp<ViewStyle>;
  onStyleKeyPress: (toolType: any) => void;
  size?: number;
  bold?: React.ReactElement<any, any>;
  italic?: React.ReactElement<any, any>;
  underline?: React.ReactElement<any, any>;
  lineThrough?: React.ReactElement<any, any>;
  body?: React.ReactElement<any, any>;
  title?: React.ReactElement<any, any>;
  heading?: React.ReactElement<any, any>;
  ul?: React.ReactElement<any, any>;
  ol?: React.ReactElement<any, any>;
  image?: React.ReactElement<any, any>;
  highlight?: React.ReactElement<any, any>;
  foreColor?: React.ReactElement<any, any>;
  style?: StyleProp<ViewStyle>;
  color?: string;
  backgroundColor?: string;
  selectedBackgroundColor?: string;
  iconContainerStyle?: StyleProp<TextStyle>;
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
