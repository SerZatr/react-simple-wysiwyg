import * as React from 'react';
import type { ChangeEvent, HTMLAttributes } from 'react';
import { EditorState, useEditorState } from '../editor';

export const BtnStyles = createDropdown('Styles', [
  ['12', 'formatBlock', 'DIV', 'font-size:12px;'],
  ['14', 'formatBlock', 'DIV', 'font-size:14px;'],
  ['16', 'formatBlock', 'DIV', 'font-size:16px;'],
  ['18', 'formatBlock', 'DIV', 'font-size:18px;'],
]);

export function createDropdown(
  title: string,
  items: DropDownItem[],
): typeof Dropdown {
  DropdownFactory.displayName = title;

  return DropdownFactory;

  function DropdownFactory(props: DropdownProps) {
    const editorState = useEditorState();

    if (editorState.htmlMode) {
      return null;
    }

    return (
      <Dropdown {...props} onChange={onChange} title={title} items={items} />
    );

    function onChange(e: ChangeEvent<HTMLSelectElement>) {
      const selected = parseInt(e.target.value, 10);
      const [, command, commandArgument, style] = items[selected];

      e.preventDefault();
      e.target.selectedIndex = 0;

      if (typeof command === 'function') {
        command(editorState);
      } else {
        document.execCommand(command, false, commandArgument);
        const listId = window.getSelection().focusNode.parentNode;
        listId.style=style;
      }
    }
  }
}

export function Dropdown({ items, selected, ...inputProps }: DropdownProps) {
  return (
    <select {...inputProps} value={selected} className="rsw-dd">
      <option hidden>{inputProps.title}</option>
      {items.map((item, index) => (
        <option key={item[2]} value={index}>
          {item[0]}
        </option>
      ))}
    </select>
  );
}

export type DropDownItem = [
  string,
  string | ((editorState: EditorState) => void),
  string,
  string
];

export interface DropdownProps extends HTMLAttributes<HTMLSelectElement> {
  selected?: number;
  items?: DropDownItem[];
}
