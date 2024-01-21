import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BookmarkFolder {
  id: number;
  name: string;
  url: string;
  bookmarks: Bookmark[];
}

interface Bookmark {
  id: number;
  name: string;
  url: string;
  icon: string;
  long_summary: string;
  short_summary: string;
}

const ClipBookmarkDropdown = ({ userId }) => {
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<BookmarkFolder | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    handleFolderFetch(userId);
  }, [userId]);

  // 유저의 폴더 조회
  const handleFolderFetch = async (user_id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/folders/list/${user_id}`);
      setBookmarkFolders(response.data);
    } catch (err) {
      console.error('Error fetching folders:', err);
    }
  };

  // 폴더 내부의 북마크 조회
  const handleBookmarkFetch = async (folder_id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/bookmarks/${folder_id}`);
      console.log(`${folder_id} 폴더의 북마크 조회 성공:`, response.data);
      setBookmarks(response.data);
    } catch (err) {
      console.error(`${folder_id} 북마크 조회 실패:`, err);
    }
  };

  // 선택된 폴더의 북마크들을 표시
  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    handleBookmarkFetch(folder.id);
  };

  return (
    <div className="border p-2 rounded shadow-md">
      <div>북마크 폴더</div>
      <ul>
        {bookmarkFolders.map((folder) => (
          <li key={folder.id} onClick={() => handleFolderSelect(folder)}>
            {folder.name}
          </li>
        ))}
      </ul>
      {selectedFolder && (
        <div>
          <h3>{selectedFolder.name} 내의 북마크</h3>
          <ul>
            {bookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <a href={bookmark.url} target="_blank" rel="noreferrer">
                  {bookmark.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClipBookmarkDropdown;