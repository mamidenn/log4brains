import { Adr } from "@src/adr/domain";
import { QueryHandler } from "@src/application";
import { ValueObjectArray } from "@src/domain";
import { SearchAdrsQuery } from "../queries";
import { AdrRepository } from "../repositories";

type Deps = {
  adrRepository: AdrRepository;
};

export class SearchAdrsQueryHandler implements QueryHandler<SearchAdrsQuery> {
  readonly queryClass = SearchAdrsQuery;

  private readonly adrRepository: AdrRepository;

  constructor({ adrRepository }: Deps) {
    this.adrRepository = adrRepository;
  }

  async execute(query: SearchAdrsQuery): Promise<Adr[]> {
    return (await this.adrRepository.findAll()).filter((adr) => {
      if (
        query.filters.statuses &&
        !ValueObjectArray.inArray(adr.status, query.filters.statuses)
      ) {
        return false;
      }
      return true;
    });
  }
}
