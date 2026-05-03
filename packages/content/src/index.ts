// @basmatech/content — public surface

// Legacy v1 modules (kept until Phase 3 migrates app pages)
export { home, ar, en, getHome } from './home';
export type { LocaleCopy, ChapterCopy } from './home';

export { portfolio, getPortfolio } from './portfolio';
export type { PortfolioCopy, RoomCopy, RoomCase, FoyerCopy, ExitCopy, Lang } from './portfolio';

export { services, getServices } from './services';
export type { ServicesPageCopy, ServiceCopy, ServiceSlug } from './services';

export { tour, getTour } from './tour';
export type { TourCopy, TourProject, FoyerCopy as TourFoyerCopy, ClosingCopy, CorridorTint } from './tour';

// Phase 1 v2: TourCanvas-driven specs + new bilingual copy
export { homeSpec } from './tourSpecHome';
export { portfolioSpec } from './tourSpecPortfolio';
export { home as homeV2, getHomeCopy } from './copy.home';
export type { HomeCopy, ChapterCopy as ChapterCopyV2 } from './copy.home';
export { portfolio as portfolioV2, getPortfolioCopy } from './copy.portfolio';
export type {
  PortfolioCopy as PortfolioCopyV2,
  ProjectCopy,
  FoyerCopy as TourFoyerV2,
  ClosingCopy as TourClosingV2,
} from './copy.portfolio';
export { seeds } from './seeds';
export type { SeedKey } from './seeds';
