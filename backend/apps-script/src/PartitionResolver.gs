var RDC_PARTITION_CONFIG = {
  MASTER_DB_PROPERTY: 'RDC_MASTER_DB_SPREADSHEET_ID',
  PARTITIONS_SHEET: 'facility_partitions',
};

function resolveFacilityPartition_(facilityId, lookup) {
  var partitions = listFacilityPartitions_(facilityId).filter(function(partition) {
    return partition.status === 'active';
  });
  var requestedRange = lookup.kind === 'date'
    ? { startDate: lookup.date, endDate: lookup.date }
    : lookup.range;
  var match = partitions.find(function(partition) {
    return partitionCoversRange_(partition, requestedRange);
  });
  return match ? { kind: 'resolved', partition: toLogicalPartition_(match) } : {
    kind: 'not-found', facilityId: facilityId, lookup: lookup,
  };
}

function listFacilityPartitions_(facilityId) {
  var masterDbId = PropertiesService.getScriptProperties().getProperty(RDC_PARTITION_CONFIG.MASTER_DB_PROPERTY);
  if (!masterDbId) throw new Error('MASTER_DB_CONFIGURATION_REQUIRED');

  var sheet = SpreadsheetApp.openById(masterDbId).getSheetByName(RDC_PARTITION_CONFIG.PARTITIONS_SHEET);
  if (!sheet) throw new Error('FACILITY_PARTITIONS_SHEET_NOT_FOUND');
  if (sheet.getLastRow() <= 1) return [];
  var headerIndex = getPartitionHeaderIndex_(sheet);
  var facilityColumn = headerIndex.facility_id + 1;
  var matches = sheet.getRange(2, facilityColumn, Math.max(sheet.getLastRow() - 1, 0), 1)
    .createTextFinder(String(facilityId)).matchEntireCell(true).findAll();

  return matches.map(function(match) {
    var row = sheet.getRange(match.getRow(), 1, 1, Object.keys(headerIndex).length).getValues()[0];
    return {
      id: String(row[headerIndex.partition_id]),
      facilityId: String(row[headerIndex.facility_id]),
      spreadsheetId: String(row[headerIndex.spreadsheet_id]),
      startDate: asIsoDate_(row[headerIndex.start_date]),
      endDate: asIsoDate_(row[headerIndex.end_date]),
      status: String(row[headerIndex.status]).toLowerCase(),
      createdAt: asIsoDate_(row[headerIndex.created_at]),
      archivedAt: asIsoDate_(row[headerIndex.archived_at]),
    };
  });
}

function getPartitionHeaderIndex_(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var required = ['partition_id', 'facility_id', 'spreadsheet_id', 'start_date', 'end_date', 'status', 'created_at', 'archived_at'];
  var index = {};
  headers.forEach(function(header, position) { index[String(header).trim().toLowerCase()] = position; });
  required.forEach(function(name) { if (index[name] === undefined) throw new Error('FACILITY_PARTITIONS_HEADER_MISSING_' + name); });
  return index;
}

function partitionCoversRange_(partition, range) {
  if (!partition.startDate) return false;
  var start = new Date(partition.startDate).getTime();
  var end = partition.endDate ? new Date(partition.endDate).getTime() : Number.POSITIVE_INFINITY;
  return new Date(range.startDate).getTime() >= start && new Date(range.endDate || range.startDate).getTime() <= end;
}

function toLogicalPartition_(partition) {
  return {
    id: partition.id,
    facilityId: partition.facilityId,
    status: partition.status,
    dateRange: { startDate: partition.startDate, endDate: partition.endDate || undefined },
    createdAt: partition.createdAt,
    archivedAt: partition.archivedAt || undefined,
  };
}

function asIsoDate_(value) {
  if (!value) return '';
  var date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? '' : date.toISOString();
}
