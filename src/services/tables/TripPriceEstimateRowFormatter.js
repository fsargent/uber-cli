import emoji from 'node-emoji';
import CurrencySymbol from 'currency-symbol-map';
import { List, Map } from 'immutable';

import DistanceUnit from '../../data/DistanceUnit';

export default class TripPriceEstimateRowFormatter {
  constructor(distanceConverter, durationFormatter) {
    const distanceUnitAbbreviations = {};
    distanceUnitAbbreviations[DistanceUnit.MILE.name] = 'mi';
    distanceUnitAbbreviations[DistanceUnit.KILOMETER.name] = 'km';

    this.distanceUnitAbbreviations = Map(distanceUnitAbbreviations);
    this.distanceConverter = distanceConverter;
    this.durationFormatter = durationFormatter;
  }

  format(estimate, rowDistanceUnit) {
    return List.of(
      estimate.productName,
      this.formatRange(estimate.range),
      this.formatDistance(estimate.distance, rowDistanceUnit),
      this.durationFormatter.format(estimate.duration),
      this.formatSurgeMultiplier(estimate.surgeMultiplier),
    );
  }

  formatRange(range) {
    const currencySymbol = CurrencySymbol(range.currencyCode);
    return `${currencySymbol}${range.low}-${currencySymbol}${range.high}`;
  }

  formatDistance(distance, rowDistanceUnit) {
    // 2 decimal places
    const convertedDistance = this.distanceConverter.convert(distance, rowDistanceUnit);
    const roundedDistanceValue = Math.round(convertedDistance.value * 100) / 100;
    return `${roundedDistanceValue} ${this.getDistanceUnitAbbreviation(convertedDistance.unit)}.`;
  }

  formatSurgeMultiplier(surgeMultiplier) {
    if (surgeMultiplier > 1) {
      return `${surgeMultiplier}x ${emoji.get('grimacing')}`;
    }

    return emoji.get('no_entry_sign');
  }

  getDistanceUnitAbbreviation(unit) {
    const abbreviation = this.distanceUnitAbbreviations.get(unit.name);
    if (abbreviation == null) {
      throw new TypeError(`Unknown unit: ${unit}`);
    }

    return abbreviation;
  }
}
