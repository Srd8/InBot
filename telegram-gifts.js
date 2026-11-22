const { dbGetGiftsCache, dbSetGiftsCache, resolveUser, callTelegramAPI, calcEffectiveStars, ADMIN_ID, ADMIN_DISCOUNT_PERCENT, setCors } = require('./_lib');

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userInfo = resolveUser(req);
  const userId = userInfo?.id || '';
  const now = Date.now();

  const cache = await dbGetGiftsCache();
  let gifts = cache.gifts || [];
  let liveSource = 'telegram_bot_api';

  try {
    if (!gifts.length || now - Number(cache.updatedAt || 0) > 5 * 60 * 1000) {
      const result = await callTelegramAPI('getAvailableGifts');
      const rawList = Array.isArray(result?.gifts) ? result.gifts : [];
      gifts = rawList.map((g) => ({{
        id: String(g.id),
        title: g.sticker?.emoji ? `${{g.sticker.emoji}} Gift #${{g.id}}` : `Telegram Gift #${{g.id}}`,
        emoji: g.sticker?.emoji || '🎁',
        star_count: Number(g.star_count || 0),
        remaining_count: g.remaining_count ?? null,
        total_count: g.total_count ?? null
      }}));
      await dbSetGiftsCache({ updatedAt: now, gifts });
    }}
  }} catch {{
    liveSource = 'fallback_catalog';
    gifts = [
      {{ id: 'tg_gift_15', title: '🧸 Plush Toy Gift', emoji: '🧸', star_count: 15 }},
      {{ id: 'tg_gift_25', title: '🌹 Velvet Rose Gift', emoji: '🌹', star_count: 25 }},
      {{ id: 'tg_gift_50', title: '🎂 Birthday Cake Gift', emoji: '🎂', star_count: 50 }},
      {{ id: 'tg_gift_100', title: '💎 Diamond Ring Gift', emoji: '💎', star_count: 100 }},
      {{ id: 'tg_gift_250', title: '👑 Royal Crown Gift', emoji: '👑', star_count: 250 }},
      {{ id: 'tg_gift_500', title: '🚀 Rocket Vault Gift', emoji: '🚀', star_count: 500 }}
    ];
  }}

  const enriched = gifts.map((g) => ({{
    ...g,
    effective_star_count: userId ? calcEffectiveStars(g.star_count, userId) : g.star_count,
    is_admin_discount: Boolean(userId && String(userId) === ADMIN_ID),
    discount_percent: userId && String(userId) === ADMIN_ID ? ADMIN_DISCOUNT_PERCENT : 0
  }}));

  return res.status(200).json({
    ok: true,
    source: liveSource,
    gifts: enriched
  });
}};
