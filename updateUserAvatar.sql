-- Start transaction
START TRANSACTION;

-- Update users with avatars, emails, phones, and descriptions
UPDATE POTATO.User
SET
    user_avatar = CASE id
        WHEN 1 THEN 'https://plus.unsplash.com/premium_photo-1658527049634-15142565537a'
        WHEN 2 THEN 'https://plus.unsplash.com/premium_photo-1670884441012-c5cf195c062a'
        WHEN 3 THEN 'https://plus.unsplash.com/premium_photo-1664536392779-049ba8fde933'
        WHEN 4 THEN 'https://images.unsplash.com/photo-1728577740843-5f29c7586afe'
        WHEN 5 THEN 'https://images.unsplash.com/photo-1636041282694-aa4e52370419'
        WHEN 6 THEN 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1'
        WHEN 7 THEN 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1'
    END,
    email = CASE id
        WHEN 1 THEN 'emma.wilson@artmail.ca'
        WHEN 2 THEN 'lucas.chen@creativearts.ca'
        WHEN 3 THEN 'sophia.taylor@artworld.ca'
        WHEN 4 THEN 'oliver.brown@digitalart.ca'
        WHEN 5 THEN 'ava.martinez@artspace.ca'
        WHEN 6 THEN 'noah.anderson@artclub.ca'
        WHEN 7 THEN 'isabella.lee@artgallery.ca'
    END,
    phone = CASE id
        WHEN 1 THEN '+1 (647) 555-0123'
        WHEN 2 THEN '+1 (416) 555-0234'
        WHEN 3 THEN '+1 (519) 555-0345'
        WHEN 4 THEN '+1 (905) 555-0456'
        WHEN 5 THEN '+1 (613) 555-0567'
        WHEN 6 THEN '+1 (289) 555-0678'
        WHEN 7 THEN '+1 (437) 555-0789'
    END,
    description = CASE id
        WHEN 1 THEN 'Visual artist specializing in contemporary oil paintings and mixed media.'
        WHEN 2 THEN 'Digital artist exploring the intersection of technology and traditional art forms.'
        WHEN 3 THEN 'Photographer capturing urban landscapes and street culture.'
        WHEN 4 THEN 'Abstract expressionist with a focus on large-scale installations.'
        WHEN 5 THEN 'Sculptor working with sustainable and recycled materials.'
        WHEN 6 THEN 'Multimedia artist combining traditional techniques with digital innovation.'
        WHEN 7 THEN 'Contemporary artist focusing on social commentary through art.'
    END
WHERE id IN (1, 2, 3, 4, 5, 6, 7);

COMMIT;

-- Verify updates
SELECT id, user_avatar, email, phone, description
FROM POTATO.User
ORDER BY id;