import { FoodItem, MealType, NutritionInfo } from '@/types';

export interface FoodSearchResult {
  id: string;
  name: string;
  nutrition: NutritionInfo;
  servingSize: number;
  unit: string;
  source: FoodItem['source'];
}

// Lithuanian local food database (per 100g)
const LOCAL_FOODS: FoodSearchResult[] = [
  { id: 'lt-001', name: 'Avižinė košė', nutrition: { calories: 68, protein: 2.4, carbs: 12, fat: 1.4 }, servingSize: 300, unit: 'g', source: 'local' },
  { id: 'lt-002', name: 'Vištienos krūtinėlė', nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, servingSize: 150, unit: 'g', source: 'local' },
  { id: 'lt-003', name: 'Kiaušiniai', nutrition: { calories: 155, protein: 13, carbs: 1.1, fat: 11 }, servingSize: 60, unit: 'g', source: 'local' },
  { id: 'lt-004', name: 'Ryžiai (virti)', nutrition: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-005', name: 'Grikiai (virti)', nutrition: { calories: 92, protein: 3.4, carbs: 20, fat: 0.6 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-006', name: 'Juoda duona', nutrition: { calories: 259, protein: 8.5, carbs: 48, fat: 3.3 }, servingSize: 40, unit: 'g', source: 'local' },
  { id: 'lt-007', name: 'Balta duona', nutrition: { calories: 265, protein: 9, carbs: 49, fat: 3.2 }, servingSize: 40, unit: 'g', source: 'local' },
  { id: 'lt-008', name: 'Pienas (2.5%)', nutrition: { calories: 52, protein: 3.4, carbs: 4.8, fat: 2.5 }, servingSize: 250, unit: 'ml', source: 'local' },
  { id: 'lt-009', name: 'Varškė (9%)', nutrition: { calories: 159, protein: 17, carbs: 3.5, fat: 9 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-010', name: 'Grietinė (30%)', nutrition: { calories: 292, protein: 2.5, carbs: 3.4, fat: 30 }, servingSize: 20, unit: 'g', source: 'local' },
  { id: 'lt-011', name: 'Sūris (vidutinis)', nutrition: { calories: 350, protein: 25, carbs: 1.3, fat: 28 }, servingSize: 30, unit: 'g', source: 'local' },
  { id: 'lt-012', name: 'Jogurtas (natūralus)', nutrition: { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-013', name: 'Bulvės (virtos)', nutrition: { calories: 77, protein: 2, carbs: 17, fat: 0.1 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-014', name: 'Morkos', nutrition: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 }, servingSize: 100, unit: 'g', source: 'local' },
  { id: 'lt-015', name: 'Kopūstai', nutrition: { calories: 25, protein: 1.3, carbs: 6, fat: 0.1 }, servingSize: 100, unit: 'g', source: 'local' },
  { id: 'lt-016', name: 'Agurkai', nutrition: { calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1 }, servingSize: 100, unit: 'g', source: 'local' },
  { id: 'lt-017', name: 'Pomidorai', nutrition: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 }, servingSize: 120, unit: 'g', source: 'local' },
  { id: 'lt-018', name: 'Obuoliai', nutrition: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 }, servingSize: 150, unit: 'g', source: 'local' },
  { id: 'lt-019', name: 'Bananai', nutrition: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 }, servingSize: 120, unit: 'g', source: 'local' },
  { id: 'lt-020', name: 'Braškės', nutrition: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 }, servingSize: 150, unit: 'g', source: 'local' },
  { id: 'lt-021', name: 'Lašiša (keptas)', nutrition: { calories: 208, protein: 20, carbs: 0, fat: 13 }, servingSize: 150, unit: 'g', source: 'local' },
  { id: 'lt-022', name: 'Silkė (marinuota)', nutrition: { calories: 218, protein: 17, carbs: 1.5, fat: 16 }, servingSize: 80, unit: 'g', source: 'local' },
  { id: 'lt-023', name: 'Spagečiai (virti)', nutrition: { calories: 131, protein: 5, carbs: 25, fat: 1.1 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-024', name: 'Makaronai (virti)', nutrition: { calories: 131, protein: 5, carbs: 25, fat: 1.1 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-025', name: 'Vištienos sriuba', nutrition: { calories: 45, protein: 3.5, carbs: 4, fat: 1.5 }, servingSize: 400, unit: 'ml', source: 'local' },
  { id: 'lt-026', name: 'Cepelinai', nutrition: { calories: 180, protein: 8, carbs: 25, fat: 6 }, servingSize: 300, unit: 'g', source: 'local' },
  { id: 'lt-027', name: 'Šaltibarščiai', nutrition: { calories: 55, protein: 3, carbs: 6, fat: 2 }, servingSize: 400, unit: 'ml', source: 'local' },
  { id: 'lt-028', name: 'Balandėliai', nutrition: { calories: 145, protein: 9, carbs: 12, fat: 7 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-029', name: 'Bulvių košė', nutrition: { calories: 90, protein: 2, carbs: 15, fat: 3 }, servingSize: 250, unit: 'g', source: 'local' },
  { id: 'lt-030', name: 'Žuvies filė (keptas)', nutrition: { calories: 148, protein: 21, carbs: 0, fat: 7 }, servingSize: 150, unit: 'g', source: 'local' },
  { id: 'lt-031', name: 'Mėsainiai / kotletai', nutrition: { calories: 235, protein: 16, carbs: 8, fat: 16 }, servingSize: 100, unit: 'g', source: 'local' },
  { id: 'lt-032', name: 'Saulėgrąžų aliejus', nutrition: { calories: 884, protein: 0, carbs: 0, fat: 100 }, servingSize: 10, unit: 'ml', source: 'local' },
  { id: 'lt-033', name: 'Sviestas', nutrition: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 }, servingSize: 10, unit: 'g', source: 'local' },
  { id: 'lt-034', name: 'Medus', nutrition: { calories: 304, protein: 0.3, carbs: 82, fat: 0 }, servingSize: 15, unit: 'g', source: 'local' },
  { id: 'lt-035', name: 'Arbata (be cukraus)', nutrition: { calories: 1, protein: 0, carbs: 0.2, fat: 0 }, servingSize: 250, unit: 'ml', source: 'local' },
  { id: 'lt-036', name: 'Kava (juoda)', nutrition: { calories: 5, protein: 0.3, carbs: 0.8, fat: 0 }, servingSize: 200, unit: 'ml', source: 'local' },
  { id: 'lt-037', name: 'Apelsinų sultys', nutrition: { calories: 45, protein: 0.7, carbs: 10, fat: 0.2 }, servingSize: 200, unit: 'ml', source: 'local' },
  { id: 'lt-038', name: 'Graikiniai riešutai', nutrition: { calories: 654, protein: 15, carbs: 14, fat: 65 }, servingSize: 30, unit: 'g', source: 'local' },
  { id: 'lt-039', name: 'Migdolai', nutrition: { calories: 579, protein: 21, carbs: 22, fat: 50 }, servingSize: 30, unit: 'g', source: 'local' },
  { id: 'lt-040', name: 'Šokoladas (tamsus)', nutrition: { calories: 546, protein: 5, carbs: 60, fat: 31 }, servingSize: 25, unit: 'g', source: 'local' },
  { id: 'lt-041', name: 'Kiaulienos sprandinė (keptas)', nutrition: { calories: 290, protein: 25, carbs: 0, fat: 21 }, servingSize: 150, unit: 'g', source: 'local' },
  { id: 'lt-042', name: 'Jautienos kepsnys', nutrition: { calories: 271, protein: 26, carbs: 0, fat: 18 }, servingSize: 150, unit: 'g', source: 'local' },
  { id: 'lt-043', name: 'Pupelės (virtos)', nutrition: { calories: 127, protein: 9, carbs: 22, fat: 0.5 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-044', name: 'Lęšiai (virti)', nutrition: { calories: 116, protein: 9, carbs: 20, fat: 0.4 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-045', name: 'Brokoliai', nutrition: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-046', name: 'Špinatai', nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }, servingSize: 100, unit: 'g', source: 'local' },
  { id: 'lt-047', name: 'Avokadas', nutrition: { calories: 160, protein: 2, carbs: 9, fat: 15 }, servingSize: 150, unit: 'g', source: 'local' },
  { id: 'lt-048', name: 'Kefyras', nutrition: { calories: 52, protein: 3.3, carbs: 4.5, fat: 2.5 }, servingSize: 250, unit: 'ml', source: 'local' },
  { id: 'lt-049', name: 'Varškės apkepas', nutrition: { calories: 195, protein: 12, carbs: 18, fat: 8 }, servingSize: 200, unit: 'g', source: 'local' },
  { id: 'lt-050', name: 'Blynai', nutrition: { calories: 210, protein: 6, carbs: 28, fat: 9 }, servingSize: 150, unit: 'g', source: 'local' },
];

export function searchLocalFood(query: string): FoodSearchResult[] {
  const q = query.toLowerCase().trim();
  return LOCAL_FOODS.filter(f => f.name.toLowerCase().includes(q)).slice(0, 10);
}

export async function searchRemoteFood(query: string): Promise<FoodSearchResult[]> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&lc=lt`
    );
    const data = await res.json();
    if (!data.products) return [];

    return (data.products as Record<string, unknown>[])
      .filter((p) => p.product_name && (p as Record<string, unknown>).nutriments)
      .map((p): FoodSearchResult => {
        const n = (p as Record<string, unknown>).nutriments as Record<string, number>;
        return {
          id: `off-${p.id || p.code}`,
          name: ((p.product_name_lt || p.product_name) as string) || 'Nežinomas produktas',
          nutrition: {
            calories: n['energy-kcal_100g'] || n['energy-kcal'] || 0,
            protein: n['proteins_100g'] || n['proteins'] || 0,
            carbs: n['carbohydrates_100g'] || n['carbohydrates'] || 0,
            fat: n['fat_100g'] || n['fat'] || 0,
            sugar: n['sugars_100g'],
            fiber: n['fiber_100g'],
            saturatedFat: n['saturated-fat_100g'],
            sodium: n['sodium_100g'],
          },
          servingSize: (n.serving_size as number) || 100,
          unit: 'g',
          source: 'openfoodfacts',
        };
      })
      .filter((p) => p.nutrition.calories > 0)
      .slice(0, 10);
  } catch {
    return [];
  }
}

export async function searchByBarcode(barcode: string): Promise<FoodSearchResult | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const p = data.product as Record<string, unknown>;
    const n = (p.nutriments as Record<string, number>) || {};
    return {
      id: `off-${barcode}`,
      name: ((p.product_name_lt || p.product_name) as string) || 'Nežinomas produktas',
      nutrition: {
        calories: n['energy-kcal_100g'] || 0,
        protein: n['proteins_100g'] || 0,
        carbs: n['carbohydrates_100g'] || 0,
        fat: n['fat_100g'] || 0,
        sugar: n['sugars_100g'],
        fiber: n['fiber_100g'],
        saturatedFat: n['saturated-fat_100g'],
        sodium: n['sodium_100g'],
      },
      servingSize: 100,
      unit: 'g',
      source: 'openfoodfacts',
    };
  } catch {
    return null;
  }
}

export function createFoodItem(result: FoodSearchResult, meal: MealType): FoodItem {
  return {
    id: `${result.id}-${Date.now()}`,
    name: result.name,
    nutrition: result.nutrition,
    servingSize: result.servingSize,
    unit: result.unit,
    source: result.source,
    meal,
    timestamp: Date.now(),
  };
}
