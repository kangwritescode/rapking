import { User } from '@prisma/client';
import { ReactRenderer } from '@tiptap/react';
import { debouncePromise } from 'src/shared/utils';
import tippy, { Instance } from 'tippy.js';
import MentionList from './MentionList';

interface UseSuggestionExtensionProps {
  threadId: string;
}

const useSuggestionExtension = ({ threadId }: UseSuggestionExtensionProps) => {
  const fetchItems = async (query: string, threadId?: string) => {
    const body = threadId ? { username: query, threadId } : { username: query };
    const response: Response = await fetch('/api/search-mention-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data: Array<Partial<User>> = await response.json();

    return data.map(item => ({
      username: item.username,
      id: item.id
    }));
  };

  const debouncedFetchItems = debouncePromise(fetchItems, 200);

  return {
    items: async ({ query }: { query: string }) => {
      if (query.length < 1) {
        return [];
      }

      const result = await debouncedFetchItems(query, threadId);

      return result;
    },

    render: () => {
      let reactRenderer: ReactRenderer & { ref: any };
      let popup: Instance[];

      return {
        onStart: (props: any) => {
          if (!props.clientRect) {
            return;
          }

          reactRenderer = new ReactRenderer(MentionList, {
            props,
            editor: props.editor
          }) as ReactRenderer & { ref: any };

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: reactRenderer.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start'
          });
        },

        onUpdate(props: any) {
          reactRenderer.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide();

            return true;
          }

          return reactRenderer?.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          reactRenderer.destroy();
        }
      };
    }
  };
};

export default useSuggestionExtension;
