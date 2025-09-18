import { TruncatedReactorAPIResponseItem } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const downloadCSV = (data: any[], filename: string) => {
    // Get headers from first item's keys
    const headers = Object.keys(data[0]);

    // Create CSV rows
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(header =>
            // Wrap values in quotes and escape existing quotes
            `"${String(row[header] || '').replace(/"/g, '""')}"`
        ).join(','))
    ];

    // Create blob and download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const flattenItem = (item: TruncatedReactorAPIResponseItem) => {
    const { id, type, attributes } = item;
    return {
        id,
        type,
        ...attributes
    };
};

// Export data elements search results to CSV
export const exportDataElementsToCSV = (
    searchResults: { id: number; matchName: string; typeName: string; delegate_descriptor_id: string; componentId: string }[],
    propertyName: string,
    ruleName: string
) => {
    if (searchResults.length === 0) return;

    const flattenedData = searchResults.map(item => ({
        name: item.matchName,
        type: `${formatDelegateDescriptorId(item.delegate_descriptor_id)} : ${item.typeName}`,
        delegateDescriptor: item.delegate_descriptor_id,
        componentId: item.componentId
    }));

    const filename = `${propertyName.replace(/\s+/g, '')}_${ruleName.replace(/\s+/g, '')}_relationship_data_elements.csv`;
    downloadCSV(flattenedData, filename);
};

// Export rules search results to CSV
export const exportRulesToCSV = (
    ruleSearchResults: TruncatedReactorAPIResponseItem[],
    propertyName: string,
    dataElementName: string
) => {
    if (ruleSearchResults.length === 0) return;

    const flattenedData = ruleSearchResults.map(flattenItem);
    const filename = `${propertyName.replace(/\s+/g, '')}_${dataElementName.replace(/\s+/g, '')}_relationship_rules.csv`;
    downloadCSV(flattenedData, filename);
};

export const formatDelegateDescriptorId = (delegate_descriptor_id: string) => {
    if (delegate_descriptor_id == '') return '';
    const [_, type, ..._rest] = delegate_descriptor_id.split('::');
    const typeVar = type.charAt(0).toUpperCase() + type.slice(1, -1);
    return typeVar;
};