import { BurgerIngredientsUI } from '@ui';
import { useMemo, useState, useRef } from 'react';

import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/ingredient-slice';

import type { TIngredient, TTabMode } from '@utils-types';

export const BurgerIngredients = (): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const ingredients = useSelector(selectIngredients);

  const onTabClick = (tab: string): void => {
    const tabMode = tab as TTabMode;
    setCurrentTab(tabMode);

    if (tabMode === 'bun') {
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabMode === 'main') {
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tabMode === 'sauce') {
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const buns = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'bun'),
    [ingredients]
  );

  const mains = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'main'),
    [ingredients]
  );

  const sauces = useMemo(
    () => ingredients.filter((item: TIngredient) => item.type === 'sauce'),
    [ingredients]
  );

  const dummyRef = () => {};

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={dummyRef}
      mainsRef={dummyRef}
      saucesRef={dummyRef}
      onTabClick={onTabClick}
    />
  );
};