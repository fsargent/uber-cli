import Table from 'cli-table2';
import { List, Map } from 'immutable';

export default class TripPriceEstimatesTableBuilder {
  constructor(rowFormatter, symbolService) {
    this.rowFormatter = rowFormatter;
    this.symbolService = symbolService;
  }

  build(estimates, presentationDistanceUnit) {
    const table = this.buildInitialTable();
    estimates.estimates.forEach((estimate) => {
      if (estimate.productName !== 'TAXI') {
        table.push(this.rowFormatter.format(estimate, presentationDistanceUnit).toJS());
      }
    });
    table.push(this.buildLocationRow(estimates.start.name, false).toJS());
    table.push(this.buildLocationRow(estimates.end.name, true).toJS());
    return table.toString();
  }

  getTableHeaders() {
    return List.of(
      this.symbolService.getVehicleSymbol(),
      this.symbolService.getPriceSymbol(),
      this.symbolService.getTripDistanceSymbol(),
      this.symbolService.getDurationSymbol(),
      `${this.symbolService.getSurgeSymbol()} Surge${this.symbolService.getSurgeSymbol()}`,
    );
  }

  buildInitialTable() {
    const table = new Table();
    const formattedHeaders = List(this.getTableHeaders().map(header => Map({ content: header, hAlign: 'center' })));
    table.push(formattedHeaders.toJS());
    return table;
  }

  buildLocationRow(name, isEnd) {
    return List.of(
      Map({
        colSpan: 1,
        content: this.getEndSymbol(isEnd),
        hAlign: 'center',
      }),
      Map({
        colSpan: 4,
        content: name,
      }),
    );
  }

  getEndSymbol(isEnd) {
    return isEnd ?
      this.symbolService.getDestinationSymbol() :
      this.symbolService.getOriginSymbol();
  }
}
