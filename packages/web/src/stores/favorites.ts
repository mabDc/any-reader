import { sendMessage } from '@/utils/postMessage';

interface FavoriteRow {
  ruleId: string;
  url: string;
}

/**
 * 收藏数据
 */
export const useFavoritesStore = defineStore('favorites', () => {
  // 已收藏列表
  const list = ref<FavoriteRow[]>([]);

  // 是否收藏
  function starred(row: FavoriteRow, ruleId: string): boolean {
    return !!list.value.find((e: FavoriteRow) => e.ruleId === ruleId && e.url === row.url);
  }

  // 同步收藏列表
  async function sync() {
    list.value = await sendMessage('getFavoritesList', {});
  }

  // 收藏 | 取消收藏
  async function star(row: any, ruleId: string) {
    await sendMessage(starred(row, ruleId) ? 'unstar' : 'star', {
      ruleId,
      data: row
    });
    sync();
  }

  return {
    list,
    sync,
    star,
    starred
  };
});
