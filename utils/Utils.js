import { readdirSync, statSync } from 'fs';
// https://gist.github.com/kethinov/6658166
export const readAllFiles = (dirPath, fileList = []) => {
    const files = readdirSync(dirPath);
    for (const file of files) {
        const filePath = dirPath + '/' + file;
        const stat = statSync(filePath);
        if (stat.isFile())
            fileList.push(filePath);
        else
            fileList = readAllFiles(filePath, fileList);
    }
    return fileList;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxJQUFJLENBQUE7QUFFMUMsMkNBQTJDO0FBQzNDLE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxDQUFDLE9BQWUsRUFBRSxXQUFxQixFQUFFLEVBQUUsRUFBRTtJQUN2RSxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDbEMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDeEIsTUFBTSxRQUFRLEdBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUE7UUFDckMsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRS9CLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7O1lBQ3JDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2pEO0lBRUQsT0FBTyxRQUFRLENBQUE7QUFDakIsQ0FBQyxDQUFBIn0=