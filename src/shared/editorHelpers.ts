export function removeTrailingAndLeadingPElements(content: string) {
    // Remove trailing empty <p></p> tags
    while (content.endsWith('<p></p>')) {
        content = content.substring(0, content.lastIndexOf('<p></p>'));
    }

    // Remove leading empty <p></p> tags
    while (content.startsWith('<p></p>')) {
        content = content.substring('<p></p>'.length);
    }

    return content;
}
