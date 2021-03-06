"use strict";
const { URL } = require("url");
const React = require("react");
const dateFormatOptionsWeekday = {
    "weekday": "long",
    "year": "numeric",
    "month": "long",
    "day": "numeric"
};
const dateFormatOptionsDay = {
    "year": "numeric",
    "month": "long",
    "day": "numeric"
};
const dateFormatOptionsMonth = {
    "year": "numeric",
    "month": "long"
};
module.exports.dateTimeFormatDay = new Intl.DateTimeFormat("en-US", dateFormatOptionsDay);
const dateTimeFormatWeekday = new Intl.DateTimeFormat("en-US", dateFormatOptionsWeekday);
const dateTimeFormatMonth = new Intl.DateTimeFormat("en-US", dateFormatOptionsMonth);
module.exports.getMetaRobots =
    (noindex) => (noindex ? React.createElement("meta", { name: "robots", content: "noindex" }) : null);
module.exports.getPublishDate = (post) => {
    const publishDateIso = post.publishDate.toISOString();
    const publishDateFormat = dateTimeFormatWeekday.format(post.publishDate);
    return (post.publishDate.getTime() > 0)
        ? React.createElement("time", { dateTime: publishDateIso }, publishDateFormat)
        : null;
};
module.exports.getReferences = (show, references, publishedPostFilter) => {
    const filteredReferences = references.filter(publishedPostFilter);
    return (show && (filteredReferences.length > 0))
        ? (React.createElement("ul", null, filteredReferences.map((reference) => (React.createElement("li", { key: reference.id },
            React.createElement("a", { href: `/blog/post/${reference.id}` }, reference.title))))))
        : null;
};
module.exports.getTagList = (tags) => tags.
    map((tag) => (React.createElement("li", { key: tag },
    React.createElement("a", { href: `/blog/tag/${tag}` }, tag))));
module.exports.getTagLinks = (tags) => {
    if (tags.length === 0) {
        return null;
    }
    const tagLinks = tags.map((tag) => (React.createElement(React.Fragment, { key: tag },
        " ",
        React.createElement("a", { href: `/blog/tag/${tag}` }, tag))));
    return React.createElement("div", { className: "tags" },
        "Tags:",
        tagLinks);
};
module.exports.getArchiveList = (archives) => archives.
    map((period) => {
    const year = period.
        getFullYear().
        toString().
        padStart(4, "0");
    const month = (period.getMonth() + 1).
        toString().
        padStart(2, "0");
    const archiveLink = `${year}${month}`;
    return (React.createElement("li", { key: archiveLink },
        React.createElement("a", { href: `/blog/archive/${archiveLink}` }, dateTimeFormatMonth.format(period))));
});
const getHeading = (props) => {
    let heading = null;
    if (props.period) {
        heading = `Posts from ${dateTimeFormatMonth.format(props.period)}`;
    }
    else if (props.tag) {
        heading = `Posts tagged "${props.tag}"`;
    }
    else if (props.query) {
        heading = `Search: ${props.query}`;
    }
    return heading;
};
module.exports.getHeading = getHeading;
const getTitle = (props, strings) => [
    props.title || getHeading(props),
    strings.title
].
    filter((part) => Boolean(part)).
    join(" - ");
module.exports.getTitle = getTitle;
const getDescription = (props, strings) => props.title || getHeading(props) || strings.description;
module.exports.getDescription = getDescription;
module.exports.getTwitterOpenGraph = (props, strings) => {
    const avatarHref = new URL(strings.avatar, props.urlHref).href;
    const description = getDescription(props, strings);
    return (React.createElement(React.Fragment, null,
        React.createElement("meta", { name: "twitter:card", content: "summary" }),
        strings.twitter ? React.createElement("meta", { name: "twitter:site", content: strings.twitter }) : null,
        strings.twitter ? React.createElement("meta", { name: "twitter:creator", content: strings.twitter }) : null,
        React.createElement("meta", { property: "og:type", content: "article" }),
        React.createElement("meta", { property: "og:title", content: description }),
        React.createElement("meta", { property: "og:url", content: props.urlHref }),
        strings.avatar ? React.createElement("meta", { property: "og:image", content: avatarHref }) : null,
        React.createElement("meta", { property: "og:site_name", content: strings.title }),
        React.createElement("meta", { property: "og:description", content: description })));
};
module.exports.getPrevNextLinks = (props) => {
    const prevLink = props.prevLink ? React.createElement("a", { href: props.prevLink },
        "\u00ab",
        " Previous Posts") : null;
    const nextLink = props.nextLink ? React.createElement("a", { href: props.nextLink },
        "Next Posts ",
        "\u00bb") : null;
    return (prevLink || nextLink)
        ? React.createElement("div", { className: "navigation" },
            prevLink,
            nextLink && prevLink ? " | " : "",
            nextLink)
        : null;
};
module.exports.getRssMetadata = (strings) => {
    const { title, description, author, copyright } = strings;
    return {
        title,
        description,
        author,
        copyright
    };
};
