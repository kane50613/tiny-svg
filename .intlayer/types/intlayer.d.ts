/* eslint-disable */
import { Locales } from 'intlayer';
import _EfK7Yut2gA0PaZzmTbRi from './about.ts';
import _dqttINxABSC7we7zUuCP from './blog.ts';
import _AYmbXRnVSIIekCCuf5ZP from './header.ts';
import _EfIeEVOhXMC1VgrfWtyZ from './home.ts';
import _qbTuA3Vc5p08AQizYlOL from './locale-switcher.ts';
import _E38UQW8QM5zyrjMZ6Esi from './optimize.ts';
import _CUnpTW1ZXdWUnpPo83GE from './plugins.ts';
import _c76Ml3Rz1hD7ZPFjiKmd from './seo.ts';

declare module 'intlayer' {
  interface IntlayerDictionaryTypesConnector {
    "about": typeof _EfK7Yut2gA0PaZzmTbRi;
    "blog": typeof _dqttINxABSC7we7zUuCP;
    "header": typeof _AYmbXRnVSIIekCCuf5ZP;
    "home": typeof _EfIeEVOhXMC1VgrfWtyZ;
    "locale-switcher": typeof _qbTuA3Vc5p08AQizYlOL;
    "optimize": typeof _E38UQW8QM5zyrjMZ6Esi;
    "plugins": typeof _CUnpTW1ZXdWUnpPo83GE;
    "seo": typeof _c76Ml3Rz1hD7ZPFjiKmd;
  }

  type DeclaredLocales = Locales.ENGLISH;
  type RequiredLocales = Locales.ENGLISH;
  type ExtractedLocales = Extract<Locales, RequiredLocales>;
  type ExcludedLocales = Exclude<Locales, RequiredLocales>;
  interface IConfigLocales<Content> extends Record<ExtractedLocales, Content>, Partial<Record<ExcludedLocales, Content>> {}
}