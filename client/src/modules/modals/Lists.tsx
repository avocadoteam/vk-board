import React from 'react';
import { useSelector } from 'react-redux';
import { getBoardLists } from 'core/selectors/board';
import { MainView } from 'core/models';
import { List, withModalRootContext } from '@vkontakte/vkui';
import { getBoardUiState } from 'core/selectors/common';
import { ListItem } from './ListItem';

type Props = {
  goForward: (activePanel: MainView) => void;
  updateModalHeight?: () => void;
};

const ListsPC = React.memo<Props>(({ updateModalHeight, goForward }) => {
  const listItems = useSelector(getBoardLists);
  const { boardListOpenId } = useSelector(getBoardUiState);

  React.useEffect(() => {
    if (updateModalHeight) {
      updateModalHeight();
    }
  }, [listItems.length, updateModalHeight, boardListOpenId]);

  return (
    <List>
      {listItems.map((listItem) => (
        <ListItem listItem={listItem} goForward={goForward} key={listItem.id} />
      ))}
    </List>
  );
});

export const Lists = withModalRootContext(ListsPC);
