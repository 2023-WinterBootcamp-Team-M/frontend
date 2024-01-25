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

const ClipBookmarkDropdown = ({ userId, onSelectBookmark }) => {
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<BookmarkFolder | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmark,setShowBookmarks] = useState(false);

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

  // 선택된 폴더의 북마크 표시
  const handleFolderSelect = (folder) => {
    setShowBookmarks(!showBookmark);
    handleBookmarkFetch(folder.id);
  };

  const handleBookmarkClick = (bookmark) => {
    onSelectBookmark(bookmark.url); // 북마크 URL을 상위 컴포넌트로 전달
  };

  return (
    <div 
    className={`border p-1 rounded shadow-md bg-[#f1f1f1] text-sm`}
    style={{
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))',
    }}>
      <div className='p-1'>내 북마크</div>
      <ul>
        {bookmarkFolders.map((folder) => (
          <li 
          className='hover:bg-gray-200 cursor-pointer transition-colors duration-300 rounded-sm p-1'
          key={folder.id} onClick={() => handleFolderSelect(folder)}>
            {folder.name}
          </li>
        ))}
      </ul>
      {showBookmark && (
        <div>
          <ul>
            {bookmarks.map((bookmark) => (
              <li 
              className='p-1 hover:bg-gray-200 cursor-pointer transition-colors duration-300 rounded-sm'
              key={bookmark.id} onClick={() => handleBookmarkClick(bookmark)}>
                {bookmark.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClipBookmarkDropdown;
