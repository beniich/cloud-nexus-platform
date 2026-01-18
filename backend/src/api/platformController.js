import pool from '../db/database.js';

export const getPlatformSettings = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM platform_settings WHERE id = 1');
        if (result.rows.length === 0) {
            return res.json({
                site_name: 'Cloud Nexus Platform',
                site_icon_url: '/favicon.ico',
                site_logo_url: '/logo.png'
            });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching platform settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updatePlatformSettings = async (req, res) => {
    const { site_name, site_description, site_icon_url, site_logo_url, primary_color } = req.body;
    const userId = req.user.userId; // Depuis le middleware d'auth

    try {
        const query = `
      UPDATE platform_settings
      SET 
        site_name = COALESCE($1, site_name),
        site_description = COALESCE($2, site_description),
        site_icon_url = COALESCE($3, site_icon_url),
        site_logo_url = COALESCE($4, site_logo_url),
        primary_color = COALESCE($5, primary_color),
        updated_at = NOW(),
        updated_by = $6::uuid
      WHERE id = 1
      RETURNING *
    `;

        const values = [site_name, site_description, site_icon_url, site_logo_url, primary_color, userId];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            // Fallback si la ligne n'existe pas (ne devrait pas arriver avec le script SQL)
            const insertQuery = `
            INSERT INTO platform_settings (id, site_name, site_description, site_icon_url, site_logo_url, primary_color, updated_by)
            VALUES (1, $1, $2, $3, $4, $5, $6::uuid)
            RETURNING *
        `;
            const insertResult = await pool.query(insertQuery, values);
            return res.json(insertResult.rows[0]);
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating platform settings:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
