using Axis.Luna.Extensions;
using static Axis.Luna.Extensions.ExceptionExtensions;

using Microsoft.Owin.FileSystems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.IO;

namespace Gaia.Server.Utils
{
    public class FilteredFileSystem : IFileSystem
    {
        private Func<string, bool> _filterPredicate { get; set; }
        private PhysicalFileSystem _physicalFS { get; set; }

        public FilteredFileSystem(string root)
        {
            _physicalFS = new PhysicalFileSystem(root.ThrowIf(_r => string.IsNullOrWhiteSpace(_r), "invalid root-path"));
        }
        /// <summary>
        /// </summary>
        /// <param name="root"></param>
        /// <param name="ignorePatterns">regular expressions representing paths to ignore while fetching content.</param>
        public FilteredFileSystem(string root, params Regex[] ignorePatterns)
        : this(root)
        {
            ignorePatterns = ignorePatterns ?? new Regex[0];
            _filterPredicate = _path => !ignorePatterns.Any(_pattern => _pattern.IsMatch(_path));
        }
        public FilteredFileSystem(string root, Func<string, bool> ignoreFilter)
        : this(root)
        {
            _filterPredicate = ignoreFilter ?? new Func<string, bool>(_path => true);
        }

        public bool TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            contents = new IFileInfo[0];
            if (_filterPredicate.Invoke(subpath)) return false;
            else return _physicalFS.TryGetDirectoryContents(subpath, out contents);
        }

        public bool TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            fileInfo = null;
            if (_filterPredicate.Invoke(subpath)) return false;
            else return _physicalFS.TryGetFileInfo(subpath, out fileInfo);
        }
    }
}